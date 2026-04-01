/*
 * Copyright 2022 The Backstage Authors
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
  createRoutableExtension,
} from "@backstage/frontend-plugin-api";

import { rootRouteRef } from './routes';import { createFrontendPlugin } from '@backstage/frontend-plugin-api';


/**
 * The todo-list plugin instance
 *
 * @public
 */
export const todoListPlugin = createFrontendPlugin({
  pluginId: 'todolist',
  routes: {
    root: rootRouteRef,
  },
});

/**
 * The Router and main entrypoint to the todo-list plugin.
 *
 * @public
 */
export const TodoListPage = todoListPlugin.provide(
  createRoutableExtension({
    name: 'TodoListPage',
    component: () =>
      import('./components/TodoListPage').then(m => m.TodoListPage),
    mountPoint: rootRouteRef,
  }),
);
