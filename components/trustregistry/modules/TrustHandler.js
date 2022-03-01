var TRUST_REGISTRY = {}
var last_updated = Date.now();
const { Console } = require('console');
const fs = require('fs');
const https = require('https')
const env = require('dotenv').config();
const { Certificate, PrivateKey } = require('@fidm/x509')

module.exports.updateRegistry = async function (){

      //DEMO which is not optimized for PROD.

      const req=  https.request(
        {
          hostname: 'ddcc-gateway.861b530c4a22413cb791.westeurope.aksapp.io',
          port: 443,
          path: '/trustList/certificate?group=DSC&withFederation=true',
          method: 'GET',
          cert: fs.readFileSync("./modules/cert.pem"),
          key: fs.readFileSync("./modules/priv.pem"),
          ca: fs.readFileSync("./modules/ca.cer")      
        },
        res => {
                  let body = "";

                  res.on("data", (chunk) => {
                      body += chunk;
                  });
                  res.on('end', function(data) {        
                              try {
                                let json = JSON.parse(body);
                                json.forEach(item=>extractAndTransform(item))
                            } catch (error) {
                                console.error(error.message);
                            };                                     }
                       );
               })  
      req.end();
}

function extractAndTransform(entry) {
  try {

    if(entry.group == 'UPLOAD') return;
    if(entry.group=='CSCA') return;

    let json = {}

    let cert = Certificate.fromPEM('-----BEGIN CERTIFICATE-----\n'+entry.certificate+'\n-----END CERTIFICATE-----')
 
    json["didDocument"] = cert.publicKey.toPEM()
    json["validFromDT"] = cert.validFrom
    json["validUntilDT"] = cert.validTo
    json["credentialType"] = []
    json["status"] = "active"

    if (entry.properties != null) {
      json = entry.properties
    } 

    if(entry.domain == 'DIVOC'){

    }

    if(entry.domain == 'DCC') {
      entry.domain = 'EUDCC'

      if(cert.getExtension('extKeyUsage','1.3.6.1.4.1.1847.2021.1.1')) {
        json["credentialType"].push('t')
      }
    
      if(cert.getExtension('extKeyUsage','1.3.6.1.4.1.1847.2021.1.2')) {
        json["credentialType"].push('v')
      }

      if(cert.getExtension('extKeyUsage','1.3.6.1.4.1.1847.2021.1.3')) {
        json["credentialType"].push('r')
      }

      if(json["credentialType"].length == 0) {
        json["credentialType"] = ['t','v','r']
      }
    }

    if(entry.domain == 'ICAO') {
    }

    if( entry.domain == 'CRED') {

    }

    if(entry.domain == 'SmartHealthCards') {
      entry.domain = 'SHC'
    }

    json["didDocument"] =  json["didDocument"].replace("-----BEGIN PUBLIC KEY-----\n","").replace("\n-----END PUBLIC KEY-----","").replaceAll("\n","")

    TRUST_REGISTRY[entry.domain] = TRUST_REGISTRY[entry.domain] ?? {}
    
    TRUST_REGISTRY[entry.domain][entry.kid]=json;
  }
  catch(e) {
    console.log(e)
  }
};

module.exports.TRUST_REGISTRY = TRUST_REGISTRY;

module.exports.initialize = function (configuration){
    
    this.updateRegistry()
    setInterval(() => this.updateRegistry(),300000);
}
