var Promise = require("promise");
var createHttpClient = require("./httpClient");
var config = require("../config");
var jose = require("node-jose");

var jwtUtils = {
  readHeader: token => {
    var sections = token.split(".");
    var header = jose.util.base64url.decode(sections[0]);
    header = JSON.parse(header);
    return header;
  },
  getAWSCognitoKeys: (userPoolId) => {
    var promise = new Promise((resolve, reject) => {
      var httpClient = createHttpClient(`https://${config.jwt.keysHost}/${userPoolId}/`); // TODO: Fix direct link to oidc.
      httpClient.get(config.jwt.keysPath).then(response => {
        if (response.status != 200) {
          reject("Cannot get keys information from AWS Cognito");
        } else {
          resolve(response.data.keys);
        }
      });
    });

    return promise;
  },
  findMatchingKey: (keys, keyId) => {
    var keyIndex = -1;
    for (var i = 0; i < keys.length; i++) {
      if (keyId == keys[i].kid) {
        keyIndex = i;
        break;
      }
    }

    return keyIndex;
  }
};

module.exports = jwtUtils;
