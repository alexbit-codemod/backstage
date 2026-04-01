/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  AlertApiForwarder,
  NoOpAnalyticsApi,
  ErrorApiForwarder,
  ErrorAlerter,
  GoogleAuth,
  GithubAuth,
  OktaAuth,
  GitlabAuth,
  MicrosoftAuth,
  BitbucketAuth,
  BitbucketServerAuth,
  OAuthRequestManager,
  WebStorage,
  OneLoginAuth,
  UnhandledErrorForwarder,
  AtlassianAuth,
  createFetchApi,
  FetchMiddlewares,
  VMwareCloudAuth,
  FrontendHostDiscovery,
  OpenShiftAuth,
} from '@backstage/core-app-api';

import {
  ApiBlueprint,
  alertApiRef,
  analyticsApiRef,
  atlassianAuthApiRef,
  bitbucketAuthApiRef,
  bitbucketServerAuthApiRef,
  configApiRef,
  discoveryApiRef,
  errorApiRef,
  fetchApiRef,
  githubAuthApiRef,
  gitlabAuthApiRef,
  googleAuthApiRef,
  identityApiRef,
  microsoftAuthApiRef,
  oauthRequestApiRef,
  oktaAuthApiRef,
  oneloginAuthApiRef,
  openshiftAuthApiRef,
  storageApiRef,
  vmwareCloudAuthApiRef,
} from "@backstage/frontend-plugin-api";
import {
  permissionApiRef,
  IdentityPermissionApi,
} from '@backstage/plugin-permission-react';

export const apis = [
  ApiBlueprint.make({ params: defineParams => defineParams({
    api: discoveryApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) => FrontendHostDiscovery.fromConfig(configApi),
  }) }),
  ApiBlueprint.make({ params: defineParams => defineParams({
    api: alertApiRef,
    deps: {},
    factory: () => new AlertApiForwarder(),
  }) }),
  ApiBlueprint.make({ params: defineParams => defineParams({
    api: analyticsApiRef,
    deps: {},
    factory: () => new NoOpAnalyticsApi(),
  }) }),
  ApiBlueprint.make({ params: defineParams => defineParams({
    api: errorApiRef,
    deps: { alertApi: alertApiRef },
    factory: ({ alertApi }) => {
      const errorApi = new ErrorAlerter(alertApi, new ErrorApiForwarder());
      UnhandledErrorForwarder.forward(errorApi, { hidden: false });
      return errorApi;
    },
  }) }),
  ApiBlueprint.make({ params: defineParams => defineParams({
    api: storageApiRef,
    deps: { errorApi: errorApiRef },
    factory: ({ errorApi }) => WebStorage.create({ errorApi }),
  }) }),
  ApiBlueprint.make({ params: defineParams => defineParams({
    api: fetchApiRef,
    deps: {
      configApi: configApiRef,
      identityApi: identityApiRef,
      discoveryApi: discoveryApiRef,
    },
    factory: ({ configApi, identityApi, discoveryApi }) => {
      return createFetchApi({
        middleware: [
          FetchMiddlewares.resolvePluginProtocol({
            discoveryApi,
          }),
          FetchMiddlewares.injectIdentityAuth({
            identityApi,
            config: configApi,
          }),
          FetchMiddlewares.clarifyFailures(),
        ],
      });
    },
  }) }),
  ApiBlueprint.make({ params: defineParams => defineParams({
    api: oauthRequestApiRef,
    deps: {},
    factory: () => new OAuthRequestManager(),
  }) }),
  ApiBlueprint.make({ params: defineParams => defineParams({
    api: googleAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
      configApi: configApiRef,
    },
    factory: ({ discoveryApi, oauthRequestApi, configApi }) =>
      GoogleAuth.create({
        configApi,
        discoveryApi,
        oauthRequestApi,
        environment: configApi.getOptionalString('auth.environment'),
      }),
  }) }),
  ApiBlueprint.make({ params: defineParams => defineParams({
    api: microsoftAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
      configApi: configApiRef,
    },
    factory: ({ discoveryApi, oauthRequestApi, configApi }) =>
      MicrosoftAuth.create({
        configApi,
        discoveryApi,
        oauthRequestApi,
        environment: configApi.getOptionalString('auth.environment'),
      }),
  }) }),
  ApiBlueprint.make({ params: defineParams => defineParams({
    api: githubAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
      configApi: configApiRef,
    },
    factory: ({ discoveryApi, oauthRequestApi, configApi }) =>
      GithubAuth.create({
        configApi,
        discoveryApi,
        oauthRequestApi,
        defaultScopes: ['read:user'],
        environment: configApi.getOptionalString('auth.environment'),
      }),
  }) }),
  ApiBlueprint.make({ params: defineParams => defineParams({
    api: oktaAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
      configApi: configApiRef,
    },
    factory: ({ discoveryApi, oauthRequestApi, configApi }) =>
      OktaAuth.create({
        configApi,
        discoveryApi,
        oauthRequestApi,
        environment: configApi.getOptionalString('auth.environment'),
      }),
  }) }),
  ApiBlueprint.make({ params: defineParams => defineParams({
    api: gitlabAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
      configApi: configApiRef,
    },
    factory: ({ discoveryApi, oauthRequestApi, configApi }) =>
      GitlabAuth.create({
        configApi,
        discoveryApi,
        oauthRequestApi,
        environment: configApi.getOptionalString('auth.environment'),
      }),
  }) }),
  ApiBlueprint.make({ params: defineParams => defineParams({
    api: oneloginAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
      configApi: configApiRef,
    },
    factory: ({ discoveryApi, oauthRequestApi, configApi }) =>
      OneLoginAuth.create({
        configApi,
        discoveryApi,
        oauthRequestApi,
        environment: configApi.getOptionalString('auth.environment'),
      }),
  }) }),
  ApiBlueprint.make({ params: defineParams => defineParams({
    api: bitbucketAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
      configApi: configApiRef,
    },
    factory: ({ discoveryApi, oauthRequestApi, configApi }) =>
      BitbucketAuth.create({
        configApi,
        discoveryApi,
        oauthRequestApi,
        defaultScopes: ['account'],
        environment: configApi.getOptionalString('auth.environment'),
      }),
  }) }),
  ApiBlueprint.make({ params: defineParams => defineParams({
    api: bitbucketServerAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
      configApi: configApiRef,
    },
    factory: ({ discoveryApi, oauthRequestApi, configApi }) =>
      BitbucketServerAuth.create({
        configApi,
        discoveryApi,
        oauthRequestApi,
        defaultScopes: ['REPO_READ'],
        environment: configApi.getOptionalString('auth.environment'),
      }),
  }) }),
  ApiBlueprint.make({ params: defineParams => defineParams({
    api: atlassianAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
      configApi: configApiRef,
    },
    factory: ({ discoveryApi, oauthRequestApi, configApi }) => {
      return AtlassianAuth.create({
        configApi,
        discoveryApi,
        oauthRequestApi,
        environment: configApi.getOptionalString('auth.environment'),
      });
    },
  }) }),
  ApiBlueprint.make({ params: defineParams => defineParams({
    api: vmwareCloudAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
      configApi: configApiRef,
    },
    factory: ({ discoveryApi, oauthRequestApi, configApi }) => {
      return VMwareCloudAuth.create({
        configApi,
        discoveryApi,
        oauthRequestApi,
        environment: configApi.getOptionalString('auth.environment'),
      });
    },
  }) }),
  ApiBlueprint.make({ params: defineParams => defineParams({
    api: openshiftAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
      configApi: configApiRef,
    },
    factory: ({ discoveryApi, oauthRequestApi, configApi }) => {
      return OpenShiftAuth.create({
        configApi,
        discoveryApi,
        oauthRequestApi,
        environment: configApi.getOptionalString('auth.environment'),
      });
    },
  }) }),
  ApiBlueprint.make({ params: defineParams => defineParams({
    api: permissionApiRef,
    deps: {
      discovery: discoveryApiRef,
      identity: identityApiRef,
      config: configApiRef,
    },
    factory: ({ config, discovery, identity }) =>
      IdentityPermissionApi.create({ config, discovery, identity }),
  }) }),
];
