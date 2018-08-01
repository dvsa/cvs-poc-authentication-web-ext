var express = require('express');
var router = express.Router();
var config = require('../config');

router.get('/',
	function (req, res) {
		// Set the mode cookie - Basic implementation for PoC.
		res.cookie(
			config.cookies.mode,
			"SAML"
		);

		var url = config.auth.saml.cognitoUrl + '/oauth2/authorize?identity_provider=' + config.auth.saml.identityProvider + '&redirect_uri=' + encodeURIComponent(config.auth.saml.redirectUri) + '&response_type=' + config.auth.saml.responseType + '&client_id=' + config.auth.saml.clientId + '&client_secret=' + config.auth.saml.clientSecret + '&scope=' + config.auth.saml.scope;
		console.log(url);
		res.redirect(url);
	}
)

module.exports = router;
