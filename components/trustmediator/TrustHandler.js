
module.exports.initialize = function (configuration){
    
    setInterval(() => updateCSCAList(configuration.cscaEndpoint), 
                                     configuration.updateInterval)

}

module.exports.updateCSCAList = function (cscaEndpoint){

//TODO Update List from internal CSCA Endpoint

}

module.exports.getCSCAList = function()  {
    return []
}