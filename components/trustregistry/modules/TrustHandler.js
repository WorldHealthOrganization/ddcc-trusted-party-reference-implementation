var TRUST_REGISTRY = {}
const fetch = require( 'cross-fetch')

module.exports.updateRegistry = async function (){

    //TODO Replace by GW Connection
    try {
        const res = await fetch('https://raw.githubusercontent.com/Path-Check/trust-registry/main/registry.json', {method: 'GET', mode: 'no-cors'})
        const data = await res.text()
        this.TRUST_REGISTRY = JSON.parse(data);
      } catch (e) {
        console.log(e);
      }  
}

module.exports.TRUST_REGISTRY = this.TRUST_REGISTRY;

module.exports.initialize = function (configuration){
    
    this.updateRegistry()
    setInterval(() => this.updateRegistry(),30000);
}