var express = require('express');
var router = express.Router();
var config = require("../config");
var jwt = require("../services/jwt.service");
var authService = require("../services/auth.service");

/* GET home page. */
router.get('/', async function (req, res, next) {
  var isLoggedIn = false;

  // Get the config to use (i.e. OIDC or SAML) - Pretty crude implementation as this is a PoC.
  var providerConfig;
  if (req.cookies[config.cookies.mode] === "OIDC") {
    providerConfig = config.auth.oidc;
  } else {
    providerConfig = config.auth.saml;
  }

  if (req.query.code) {
    var code = req.query.code;
    status = code ? "logging in" : "";

    authService
      .requestAccessToken(code, providerConfig)
      .then(async token => {
        res.cookie(
          config.cookies.auth,
          { accessToken: token.access_token, idToken: token.id_token },
          { maxAge: token.expires_in * 1000, httpOnly: true }
        );
        res.cookie(
          config.cookies.refresh,
          { refreshToken: token.refresh_token },
          { maxAge: 2592000000, httpOnly: true }
        );

        res.redirect("/");
      })
      .catch(error => {
        console.log(error);
        res.render("index", {
          isLoggedIn,
          error: error
        });
      });
  }
  else {
    // Would also implement strategies to handle use of refresh token to get another auth token. But these are out
    // of scope for this PoC.
    var accessToken, accessTokenInfo, idToken, idTokenInfo;

    if (req.cookies[config.cookies.auth]) {
      isLoggedIn = true;
      accessToken = req.cookies[config.cookies.auth].accessToken;
      idToken = req.cookies[config.cookies.auth].idToken;

      // Validate JWT tokens.
      const getAccessTokenInfoPromise = jwt.validateJWTToken(accessToken, providerConfig);
      const getIdTokenInfoPromise = jwt.validateJWTToken(idToken, providerConfig);

      try {
        const [accessTokenInfo, idTokenInfo] = [
          await getAccessTokenInfoPromise,
          await getIdTokenInfoPromise
        ];

        res.render("index", {
          isLoggedIn,
          accessToken,
          accessTokenInfo,
          idToken,
          idTokenInfo
        });
      } catch (error) {
        res.render("index", {
          error
        });
      }
    } else {

      var error;
      if (req.query.error) {
        error = {
          message: req.query.error_description,
          stack: req.query.error
        };
      }

      res.render("index", {
        isLoggedIn,
        error: error
      });
    }
  }

});

module.exports = router;
