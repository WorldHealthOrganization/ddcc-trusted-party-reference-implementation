const express = require('express')
const app = express()
const fs = require('fs');
const jose = require('jose')
const {X509Certificate} = require('crypto')

const oauth = require('./OAuthClientCredentialFlow')
const trusthandler = require('./TrustHandler')
const policyhandler = require('./PolicyHandler')

const port = 3000
var configuration = null;

app.get('/token', (req, res) => {
 
    if(req.query.type == null || !(req.query.type != null && 
      (req.query.type.toString() == 'access' || 
       req.query.type.toString()  == 'register' ))) {
    
      return res.status(400).send();
    }

    if(req.headers.authorization == null) {
       return res.status(401).send();
    }

    let token = req.headers.authorization.substring(7)

    const protectedHeader = jose.decodeProtectedHeader(token)
    const payload = jose.decodeJwt(token)
    if(protectedHeader.x5c == null || protectedHeader.x5c.length == 0) {
        return res.status(401).send();
    }

    const x509 = new X509Certificate(Buffer.from(protectedHeader.x5c[0], 'base64'))

    if(x509 == null) {
        return res.status(400).send();
    }

    let allowedToProceed = policyhandler.allowedToProceed(configuration,payload.sub,x509.fingerprint256)
    
    if(allowedToProceed) {

        let cscaStore = trusthandler.getCSCAList();

        if(cscaStore.length == 0) {
            return res.status(401).send();
        }

        let csca = new X509Certificate(Buffer.from(cscaStore[0], 'base64'))
        let result = x509.checkIssued(csca)

        if(result) {
            oauth.getToken(configuration,req.query.type).then(function(value){
                 return res.status(200).send(value);
            }).catch(function(){
                 return res.status(401).send();
            });
          
        }
    }
})

app.listen(port, () => {
    let path = process.env.TM_CONFIG_PATH;

    if(path == null) {
        path = "configuration.json"
    }

    let rawdata = fs.readFileSync(path);
    configuration = JSON.parse(rawdata);

    console.log(`Server started on Port ${port}`)
})

