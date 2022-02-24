const { ClientCredentials, ResourceOwnerPassword, AuthorizationCode } = require('simple-oauth2');


module.exports.getToken = async function (configuration,type) {

  const registerConfig = {
    client: {
      id: configuration.register.clientId,
      secret: configuration.register.clientSecret
    },
    auth: {
      tokenHost: configuration.register.tokenHost,
      tokenPath: configuration.register.tokenPath
    }
  };

  const accessConfig = {
    client: {
      id: configuration.access.clientId,
      secret: configuration.access.clientSecret
    },
    auth: {
      tokenHost: configuration.access.tokenHost,
      tokenPath: configuration.access.tokenPath
    }
  };

  if (type == 'access') {
    return await getAccessToken(accessConfig,configuration.access.scope);
  }
 
  if(type == 'register') {
    return await getAccessToken(registerConfig,configuration.register.scope);
  }
  
}

async function getAccessToken(config,scope) {
    var client = new ClientCredentials(config); 
    var tokenParams = {
      scope: scope
    };
  
    try {
      return await client.getToken(tokenParams);
    } catch (error) {
      console.log('Access Token error', error);
    }
}
