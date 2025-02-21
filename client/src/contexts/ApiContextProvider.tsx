import ApiClient from '../ApiClient';
import { ApiContext } from './ApiContext';

export default function ApiContextProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  const api = new ApiClient();

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
}
