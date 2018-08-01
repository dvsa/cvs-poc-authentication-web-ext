var express = require('express');
var router = express.Router();
var config = require('../config');

router.get('/',
	function (req, res) {
		// Set the mode cookie - Basic implementation for PoC.
		res.cookie(
			config.cookies.mode,
			"OIDC"
		);

		var url = config.auth.oidc.cognitoUrl + '/oauth2/authorize?identity_provider=' + config.auth.oidc.identityProvider + '&redirect_uri=' + encodeURIComponent(config.auth.redirectUri) + '&response_type=' + config.auth.responseType + '&client_id=' + config.auth.oidc.clientId + '&client_secret=' + config.auth.oidc.clientSecret + '&scope=' + config.auth.scope;
		console.log(url);
		res.redirect(url);
	}
)

module.exports = router;
