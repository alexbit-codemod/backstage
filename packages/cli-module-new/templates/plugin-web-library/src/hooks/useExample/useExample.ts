import { useEffect } from 'react';
import {
  alertApiRef,
  useApi,
} from "@backstage/frontend-plugin-api";

/**
 * Shows an example alert.
 *
 * @public
 */
export function useExample() {
  const alertApi = useApi(alertApiRef);

  useEffect(() => {
    alertApi.post({ message: 'Hello World!' });
  }, [alertApi]);
}
