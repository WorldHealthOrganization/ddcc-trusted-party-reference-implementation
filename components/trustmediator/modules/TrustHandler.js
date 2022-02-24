
module.exports.initialize = function (configuration){
    
    setInterval(() => updateCSCAList(configuration.cscaEndpoint), 
                                     configuration.updateInterval)

}

module.exports.updateCSCAList = function (cscaEndpoint){

//TODO Update List from internal CSCA Endpoint

}

module.exports.getCSCAList = function()  {
    return ["MIIBsjCCAVgCCQD6rBNE5ROFTTAKBggqhkjOPQQDAjBhMQswCQYDVQQGEwJERTEL"+
    "MAkGA1UECAwCREUxCzAJBgNVBAcMAkRFMQswCQYDVQQKDAJERTELMAkGA1UECwwC"+
    "REUxCzAJBgNVBAMMAkRFMREwDwYJKoZIhvcNAQkBFgJERTAeFw0yMjAyMDgwOTU2"+
    "MTZaFw0yNjAyMDgwOTU2MTZaMGExCzAJBgNVBAYTAkRFMQswCQYDVQQIDAJERTEL"+
    "MAkGA1UEBwwCREUxCzAJBgNVBAoMAkRFMQswCQYDVQQLDAJERTELMAkGA1UEAwwC"+
    "REUxETAPBgkqhkiG9w0BCQEWAkRFMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE"+
    "vFRM9JDZRZ8HeZceXo6b7muLLayW2Kk3bwV6GcGGecVXf2zLIHa5ytnAc0OFWSBF"+
    "PlbFk6znh/LOZVu91fmtJTAKBggqhkjOPQQDAgNIADBFAiAtyWeBxcxpTsXufpnk"+
    "wtEgG6NnyShLRMLnBaammZTp9QIhANTszr6GgHc+OuPIcATQNp1lM/vXdeqkLB8T"+
    "d9lcYuTg"]
}