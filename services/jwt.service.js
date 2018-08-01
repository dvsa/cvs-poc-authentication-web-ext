var jose = require("node-jose");
var jsonPretty = require("json-pretty-html").default;
var config = require("../config");
var createHttpClient = require("../utils/httpClient");
var jwtUtils = require("../utils/jwt.utils");

var jwtService = {
  validateJWTToken: async (token, providerConfig) => {
    var header = jwtUtils.readHeader(token);

    const keys = await jwtUtils.getAWSCognitoKeys(providerConfig.userPoolId);
    const keyIndex = jwtUtils.findMatchingKey(keys, header.kid);

    if (keyIndex == -1) {
      reject("Public key not found in jwks.json");
    } else {
      const publicKey = await jose.JWK.asKey(keys[keyIndex]);
      const validToken = await jose.JWS.createVerify(publicKey).verify(token);

      // Token is valid - now validate the claims
      var validity = { message: "", isValid: false };
      var claims = JSON.parse(validToken.payload);
      current_ts = Math.floor(new Date() / 1000);

      if (current_ts > claims.exp) {
        // Validate expiry
        validity.message = "Token has expired";
        validity.isValid = false;
      } else if (claims.aud && claims.aud != providerConfig.clientId) { // TODO: OIDC
        // Validate audience
        validity.message = "Token not issued for this audience";
        validity.isValid = false;
      } else {
        // Is valid
        validity.message = "Token is valid";
        validity.json = jsonPretty(JSON.parse(validToken.payload));
        validity.isValid = true;
      }

      return validity;
    }
  }
};

module.exports = jwtService;
