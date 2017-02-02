var qs = require('querystring');

var urlOptionsCode = {
            'client_id' : 'clientId',
            'response_type' : 'code',
            'scope' : 'scopes[0]',
            'redirect_uri': 'redirectUri',
            'access_type':'offline',
            'prompt':'consent',
            'login_hint':'rafabenitezta@gmail.com'
        }
        
        var authUrl = 'localhost:3000' + '?' + qs.stringify(urlOptionsCode);
        console.log("Auth code url: " + authUrl);
     

