/*
 * Copyright 2021 The Backstage Authors
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
  OAuthRequestManager,
  WebStorage,
  UrlPatternDiscovery,
  OneLoginAuth,
  UnhandledErrorForwarder,
  AtlassianAuth,
} from '@backstage/core-app-api';

import {
  ApiBlueprint,
  alertApiRef,
  analyticsApiRef,
  atlassianAuthApiRef,
  bitbucketAuthApiRef,
  configApiRef,
  discoveryApiRef,
  errorApiRef,
  githubAuthApiRef,
  gitlabAuthApiRef,
  googleAuthApiRef,
  microsoftAuthApiRef,
  oauthRequestApiRef,
  oktaAuthApiRef,
  oneloginAuthApiRef,
  storageApiRef,
} from "@backstage/frontend-plugin-api";

// TODO(Rugvip): This is just a copy of the createApp default APIs for now, but
//               we should clean up this list a bit move more things over to mocks.
export const defaultApis = [
  ApiBlueprint.make({ params: defineParams => defineParams({
    api: discoveryApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) =>
      UrlPatternDiscovery.compile(
        `${configApi.getString('backend.baseUrl')}/api/{{ pluginId }}`,
      ),
  }) }),
  createApiFactory(alertApiRef, new AlertApiForwarder()),
  createApiFactory(analyticsApiRef, new NoOpAnalyticsApi()),
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
  createApiFactory(oauthRequestApiRef, new OAuthRequestManager()),
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
];
