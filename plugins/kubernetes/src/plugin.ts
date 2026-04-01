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
  KubernetesBackendClient,
  kubernetesApiRef,
  kubernetesProxyApiRef,
  kubernetesAuthProvidersApiRef,
  KubernetesAuthProviders,
  KubernetesProxyClient,
  kubernetesClusterLinkFormatterApiRef,
  getDefaultFormatters,
  KubernetesClusterLinkFormatter,
  DEFAULT_FORMATTER_NAME,
} from '@backstage/plugin-kubernetes-react';
import {
  ApiBlueprint,
  createRoutableExtension,
  discoveryApiRef,
  fetchApiRef,
  gitlabAuthApiRef,
  googleAuthApiRef,
  microsoftAuthApiRef,
  oktaAuthApiRef,
  oneloginAuthApiRef,
} from "@backstage/frontend-plugin-api";import { createRouteRef , createFrontendPlugin} from '@backstage/frontend-plugin-api';


export const rootCatalogKubernetesRouteRef = createRouteRef();

export const kubernetesPlugin = createFrontendPlugin({
  pluginId: 'kubernetes',
  apis: [
    ApiBlueprint.make({ params: defineParams => defineParams({
      api: kubernetesApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
        kubernetesAuthProvidersApi: kubernetesAuthProvidersApiRef,
      },
      factory: ({ discoveryApi, fetchApi, kubernetesAuthProvidersApi }) =>
        new KubernetesBackendClient({
          discoveryApi,
          fetchApi,
          kubernetesAuthProvidersApi,
        }),
    }) }),
    ApiBlueprint.make({ params: defineParams => defineParams({
      api: kubernetesProxyApiRef,
      deps: {
        kubernetesApi: kubernetesApiRef,
      },
      factory: ({ kubernetesApi }) =>
        new KubernetesProxyClient({
          kubernetesApi,
        }),
    }) }),
    ApiBlueprint.make({ params: defineParams => defineParams({
      api: kubernetesAuthProvidersApiRef,
      deps: {
        gitlabAuthApi: gitlabAuthApiRef,
        googleAuthApi: googleAuthApiRef,
        microsoftAuthApi: microsoftAuthApiRef,
        oktaAuthApi: oktaAuthApiRef,
        oneloginAuthApi: oneloginAuthApiRef,
      },
      factory: ({
        gitlabAuthApi,
        googleAuthApi,
        microsoftAuthApi,
        oktaAuthApi,
        oneloginAuthApi,
      }) => {
        const oidcProviders = {
          gitlab: gitlabAuthApi,
          google: googleAuthApi,
          microsoft: microsoftAuthApi,
          okta: oktaAuthApi,
          onelogin: oneloginAuthApi,
        };

        return new KubernetesAuthProviders({
          microsoftAuthApi,
          googleAuthApi,
          oidcProviders,
        });
      },
    }) }),
    ApiBlueprint.make({ params: defineParams => defineParams({
      api: kubernetesClusterLinkFormatterApiRef,
      deps: { googleAuthApi: googleAuthApiRef },
      factory: deps => {
        const formatters = getDefaultFormatters(deps);
        return new KubernetesClusterLinkFormatter({
          formatters,
          defaultFormatterName: DEFAULT_FORMATTER_NAME,
        });
      },
    }) }),
  ],
  routes: {
    entityContent: rootCatalogKubernetesRouteRef,
  },
});

/**
 * Props of EntityKubernetesContent
 *
 * @public
 */
export type EntityKubernetesContentProps = {
  /**
   * Sets the refresh interval in milliseconds. The default value is 10000 (10 seconds)
   */
  refreshIntervalMs?: number;
};

export const EntityKubernetesContent: (
  props: EntityKubernetesContentProps,
) => JSX.Element = kubernetesPlugin.provide(
  createRoutableExtension({
    name: 'EntityKubernetesContent',
    component: () => import('./Router').then(m => m.Router),
    mountPoint: rootCatalogKubernetesRouteRef,
  }),
);
