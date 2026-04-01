import {
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
  ScmAuth,
} from '@backstage/integration-react';
import {
  AnyApiFactory,
  ApiBlueprint,
  configApiRef,
} from "@backstage/frontend-plugin-api";

export const apis: AnyApiFactory[] = [
  ApiBlueprint.make({ params: defineParams => defineParams({
    api: scmIntegrationsApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
  }) }),
  ScmAuth.createDefaultApiFactory(),
];
