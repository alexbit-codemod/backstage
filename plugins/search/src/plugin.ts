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

import { SearchClient } from './apis';
import { searchApiRef } from '@backstage/plugin-search-react';
import {
  ApiBlueprint,
  createComponentExtension,
  createRoutableExtension,
  discoveryApiRef,
  fetchApiRef,
} from "@backstage/frontend-plugin-api";
import { SidebarSearchModalProps } from './components/SidebarSearchModal';import { createRouteRef , createFrontendPlugin} from '@backstage/frontend-plugin-api';


export const rootRouteRef = createRouteRef();

/**
 * @public
 */
export const searchPlugin = createFrontendPlugin({
  pluginId: 'search',
  apis: [
    ApiBlueprint.make({ params: defineParams => defineParams({
      api: searchApiRef,
      deps: { discoveryApi: discoveryApiRef, fetchApi: fetchApiRef },
      factory: ({ discoveryApi, fetchApi }) => {
        return new SearchClient({ discoveryApi, fetchApi });
      },
    }) }),
  ],
  routes: {
    root: rootRouteRef,
  },
});

/**
 * @public
 */
export const SearchPage = searchPlugin.provide(
  createRoutableExtension({
    name: 'SearchPage',
    component: () => import('./components/SearchPage').then(m => m.SearchPage),
    mountPoint: rootRouteRef,
  }),
);

/**
 * @public
 */
export const SidebarSearchModal = searchPlugin.provide<
  (props: SidebarSearchModalProps) => JSX.Element | null
>(
  createComponentExtension({
    name: 'SidebarSearchModal',
    component: {
      lazy: () =>
        import('./components/SidebarSearchModal').then(
          m => m.SidebarSearchModal,
        ),
    },
  }),
);

/**
 * @public
 */
export const HomePageSearchBar = searchPlugin.provide(
  createComponentExtension({
    name: 'HomePageSearchBar',
    component: {
      lazy: () =>
        import('./components/HomePageComponent').then(m => m.HomePageSearchBar),
    },
  }),
);
