var TRUST_REGISTRY = {}
var last_updated = Date.now();
const { Console } = require('console');
const fs = require('fs');
const https = require('https')
const env = require('dotenv').config();

module.exports.updateRegistry = async function (){

      //DEMO which is not optimized for PROD.

      const req=  https.request(
        {
          hostname: process.env.HOST,
          port: 443,
          path: '/trustList/certificate?group=DSC&withFederation=true',
          method: 'GET',
          cert: fs.readFileSync(process.env.AUTHCERTPATH),
          key: fs.readFileSync(process.env.AUTHKEYCERTPATH),
          ca: fs.readFileSync(process.env.CACERTPATH)     
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
    let json = {}

    if (entry.properties != null) {
      json = entry.properties
    } 

    if(entry.domain == 'DCC') {
      entry.domain = 'EUDCC'
    }

    json["didDocument"] = entry.certificate;

    TRUST_REGISTRY[entry.domain] = TRUST_REGISTRY[entry.domain] ?? {}
    
    TRUST_REGISTRY[entry.domain][entry.kid]=json;
};

module.exports.TRUST_REGISTRY = TRUST_REGISTRY;

module.exports.initialize = function (configuration){
    
    this.updateRegistry()
    setInterval(() => this.updateRegistry(),30000);
}
