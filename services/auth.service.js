var Promise = require('promise');
var queryString = require('querystring');
var base64 = require('base-64');
var createHttpClient = require('../utils/httpClient');
var config = require('../config');

var authService = {
    requestAccessToken: (code, providerConfig) => {

        const secret = base64.encode(`${providerConfig.clientId}:${providerConfig.clientSecret}`);
        const defaults = {
            headers: {
                Authorisation: `Basic ${secret}`,
            },
        };

        var httpClient = createHttpClient(providerConfig.cognitoUrl, defaults);

        var promise = new Promise((resolve, reject) => {
            const payload = {
                grant_type: config.auth.grantType,
                client_id: providerConfig.clientId,
                client_secret: providerConfig.clientSecret,
                redirect_uri: config.auth.redirectUri,
                code,
            };

            httpClient.post(config.auth.oAuthEndpoint, queryString.stringify(payload))
                .then((result) => {
                    resolve(result.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });

        return promise;
    }
};

module.exports = authService;