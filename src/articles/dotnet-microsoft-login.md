---
title: Microsoft authentication in .NET Core
description: How to let users login with a Microsoft account in .NET Core
image: ./images/microsoft-authentication.png
author: Valeriy Novytskyy
date: 2022-06-03
pinned: true
location: Emerald Line
tags:
  [
     'engineering-software', 'engineering-architecture'
  ]
---

import AuthenticationProcess from './components/microsoft-auth-process';
import AuthorizationGrant from './components/authorization-code-grant';
import Code from '../components/Post/Code';
import { Tabs, Tab } from '../components/Tabs'

## overview

Follow this tutorial to enable users to sign in to your [ASP.NET Core](https://dotnet.microsoft.com/en-us/download) application with their work, school, or personal Microsoft account by using the official [Microsoft.AspNetCore.Authentication.MicrosoftAccount](https://www.nuget.org/packages/Microsoft.AspNetCore.Authentication.MicrosoftAccount/) NuGet package.

<Tabs>
  <Tab label="Visual Studio">
    <p>
      To create a new .NET Core application in <strong>Visual Studio</strong>:
    </p>
    <ul>
      <li>Select the <em>ASP.NET Core Web App</em> template and name the project</li>
      <li>Select <em>Individual User Accounts</em> as the <em>Authentication type</em></li>
    </ul>
  </Tab>
  <Tab label="VS Code Mac">
    <p>To create a new .NET Core application in <strong>Visual Studio Code</strong> on <em>Mac</em>:</p>
    <Code>
      dotnet new webapp -o projectname -au Individual
    </Code>
    <p><em>SQLite</em> will be used as the database by default.</p>
  </Tab>
  <Tab label="VS Code Windows">
    <p>To create a new .NET Core application in <strong>Visual Studio Code</strong> on <em>Windows</em>:</p>
    <Code>
      dotnet new webapp -o projectname -au Individual -uld
    </Code>
    <p><em>LocalDB</em> will be used as the database with the <code>-uld</code> option.</p>
  </Tab>
</Tabs>

Install the [MicrosoftAccount](https://www.nuget.org/packages/Microsoft.AspNetCore.Authentication.MicrosoftAccount/) package used for authentication in this tutorial:

```bash
dotnet add package \
Microsoft.AspNetCore.Authentication.MicrosoftAccount
```

Run the new application to verify the initial setup was successful:

```bash
dotnet run
```

## app registration

Signing in with an [OAuth](https://oauth.net/) provider like Microsoft requires registering your application to get a unique *Client ID* and *Client Secret* which are like a user name and password used by the provider to identify your application. For Microsoft accounts this is done by creating an App Registration in Azure Portal.

1. Sign in to the [Azure Portal](https://portal.azure.com/)
2. Open the [App Registrations](https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/) blade of [Azure Active Directory](https://portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade) service
3. Click [New Registration](https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/CreateApplicationBlade/quickStartType~/null/isMSAApp~/false)

Enter a *Name* and select a *Supported account type*:

* The [MicrosoftAccount](https://www.nuget.org/packages/Microsoft.AspNetCore.Authentication.MicrosoftAccount/) package used in this tutorial supports *"Accounts in any organizational directory (Any Azure AD directory - Multitenant)"* and *"Accounts in any organizational directory (Any Azure AD directory - Multitenant) and personal Microsoft accounts (e.g. Skype, Xbox)
"* options by default.
* To use the other options you will have to pass in additional settings when configuring the authentication middleware in the next step.

Select the *Web* platform under *Redirect URI* and enter your development URL, appending */signin-microsoft* to the end, for example:

```
https://localhost:7158/signin-microsoft
```

> The Microsoft authentication middleware automatically handles requests at `/signin-microsoft` route to implement the OAuth flow. The route name can be customized when configuring the middleware later.

Click *Register* to create the App Registration.

## secret storage

With .NET core you have many options for storing sensitive settings:

* [Environment variables](https://docs.microsoft.com/en-us/aspnet/core/security/app-secrets#environment-variables) for local, on-premise, or cloud development
* [Secret Manager](https://docs.microsoft.com/en-us/aspnet/core/security/app-secrets#secret-manager) for local development
* [Azure App Configuration](https://docs.microsoft.com/en-us/azure/azure-app-configuration/overview) for cloud development on a budget
* [Azure Key Vault](https://docs.microsoft.com/en-us/azure/key-vault/general/basic-concepts) for enterprise cloud development

Multiple providers can be configured to merge settings from different sources. For example you can use the *Secret Manager* for local development and your application will switch to *Azure KeyVault* when it's running in the cloud.

In this tutorial we'll stick to the *Secret Manager* even though Environment Variables are a more universal way to load settings because .NET Core does not support `.env` files out of the box. See the [Dusted Codes tutorial](https://dusted.codes/dotenv-in-dotnet) for creating a custom settings provider to load from `.env` if you're interested.

Locate the *Application (client) ID* field on the *Overview* page of the new App Registration and substitute it for `<client-id>` in the following command:

```bash
dotnet user-secrets \
set "Authentication:Microsoft:ClientId" "<client-id>"
```

Generate and configure a secret for your App Registration:

1. Go to the *Certificates & secrets* blade of the App Registration and click *New client secret*
2. Enter your description and select expiration
3. Click *Add* on the bottom of the blade

You will see a new row added to *Client secrets* on *Certificates & secrets* blade, with the *Value* field containing the secret you need for this step. 

> Ignore the *Secret ID* field as that's a unique ID for the secret itself, needed because Azure lets you configure multiple secrets.

Configure the client secret for your application using the *Secret Manager*:

```bash
dotnet user-secrets \
set "Authentication:Microsoft:ClientSecret" "<secret>"
```

## auth middleware

The last step is to configure the Microsoft authentication middleware by calling `AddAuthentication` and then `AddMicrosoftAccount`:

```clike
builder.Services
    .AddAuthentication()
    .AddMicrosoftAccount(microsoftOptions =>
  {
      microsoftOptions.ClientId = builder.Configuration
        ["Authentication:Microsoft:ClientId"];
      microsoftOptions.ClientSecret = builder.Configuration
        ["Authentication:Microsoft:ClientSecret"];
  });
```

If you selected *"Accounts in this organizational directory only (Default Directory only - Single tenant)"* or *"Personal Microsoft accounts only"* account type when creating the App Registration, click *Endpoints* on the App Registration *Overview* blade to look up the endpoints to use.

> The account type selected when creating the App Registration is available on Authentication blade under Supported account types.

* The *OAuth 2.0 authorization endpoint (v2)* contains the value for `AuthorizationEnpoint` option in the snippet below.
* The *OAuth 2.0 token endpoint (v2)* contains the value for `TokenEndpoint` option in the snippet below.

These settings are not secrets and can be stored in `appsettings.json`. Plug them into the call to `AddMicrosoftAccount` added in the previous listing:
```clike
microsoftOptions.AuthorizationEndpoint = builder.Configuration
  ["Authentication:Microsoft:AuthorizationEndpoint"];
microsoftOptions.TokenEndpoint = builder.Configuration
  ["Authentication:Microsoft:TokenEndpoint"];
```

## test authentication

Your users will have to go through the following steps to create a new account:

* Click *Login* on the top navigation
* On the Login page under *Use Another Service to Login*, click *Microsoft*
* You will be redirected to login with your Microsoft account
* *Accept* to be redirected back to your application to finish registration
* *Register* to create a new user account in the database using the email address extracted from the user's Microsoft account
* Confirm your email to complete the new account setup

## how it works

The package used in this tutorial implements the OAuth 2 [Authorization Code Grant](https://www.oauth.com/oauth2-servers/server-side-apps/authorization-code/) on the backend. See Aaron Parecki's [friendly description](https://aaronparecki.com/oauth-2-simplified/#web-server-apps) of this flow.

<AuthenticationProcess />

1. The user clicks *Login* → *Login with Another Provider* → *Microsoft*
2. The OAuth middleware in `MicrosoftAccount` package redirects the user to `oauth2/v2.0/authorize` endpoint
3. Azure AD redirects back to your ASP.NET backend, sending either the *authorization code* or an error
4. The middleware in `MicrosoftAccount` package intercepts the request and calls the Azure Active Directory `token` endpoint to exchange the authorization code it received with an *access token*
5. Azure AD returns an *OAuth 2.0* token to your ASP.NET backend, which can be used to access user profile information
6. The user is authorized to access password-protected parts of your application, and has an option to create an individual account so that they can access your application directly without the Microsoft login

The following section details what happens during the authorization grant process.

<AuthorizationGrant />

The OAuth middleware in `MicrosoftAccount` package redirects the user to `oauth2/v2.0/authorize` endpoint:

|query parameter|value|
|-|-|
|`client id`|App Registration Client ID|
|`response_type`|`code`|
|`state`|Unique authorization request identifier|
|`redirect_uri`|Must match redirect URI in App Registration|
|`scope`|`profile`|

Azure AD redirects back to your ASP.NET backend, sending either the *authorization code* or an error:

|query parameter|value|
|-|-|
|`code`|Authorization code|
|`state`|The same value provided for `state` earlier

The middleware in `MicrosoftAccount` package intercepts the request and calls the Azure Active Directory `token` endpoint to exchange the authorization code it received with an *access token*:

|form parameter|value|
|-|-|
|`grant_type`|`authorization_code`|
|`code`|The value received from the previous request|
|`redirect_uri`|Must match the same value from the first request|
|`client_id`|App Registration Client ID|
|`client_secret`|App Registration Secret|

When the .NET application returns the successful response back to the browser, it will set `.AspNetCore.Identity.Application` cookie containing a session for the logged in user account.
