# Authentication Proof of Concept - Web Internal
This PoC is to validate the authentication and authorisation solution for external users accessing CVS resource via Azure AD B2C authentication.

## Getting Started
To get the project working locally you'll need to install git secrets as this is used as a prepush check to mitigate the release of secrets into the public. For more information check the [Git Secrets Github Repo](https://github.com/awslabs/git-secrets).

Additionally, to use this PoC you need to add a `config.js` file to the root of the directory.  This file should be of the following format:

```javascript
const config = {
    auth: {
        redirectUri: 'Azure AD Redirect URI',
        logoutUri: 'AWS Cognito Logout URI',
        responseType: 'OAuth Response Type',
        scope: 'Required Authorization Scope', 
        grantType: 'OAuth Grant Type',
        oAuthEndpoint: 'OAuth Endpoint (e.g. .../token)',
        oidc: {
            clientId: 'AWS Cognito Client ID',
            clientSecret: 'AWS Cognito Client Secret',
            cognitoUrl: 'AWS Cognito User Pool  URL',
            identityProvider: 'AWS Cognito Identity Provider - Links to Azure AD Application.',
            userPoolId: 'AWS Cognito User Pool'
        },
        saml: {
            clientId: 'AWS Cognito Client ID',
            clientSecret: 'AWS Cognito Client Secret',
            cognitoUrl: 'AWS Cognito User Pool  URL',
            identityProvider: 'AWS Cognito Identity Provider - Links to Azure AD Application.',
            userPoolId: 'AWS Cognito User Pool'
        }
    },
    cookies: {
        auth: 'Auth Cookie Name',
        refresh: 'Refresh Cookie Name',
        mode: 'Mode'
    },
    jwt: {
        keysHost: "AWS Cognito Keys Host Name",
        keysPath: "AWS Cognito Keys Path (e.g. jwks.json)"
    },
};

module.exports = config;
```