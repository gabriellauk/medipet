import { createContext, useContext } from 'react';
import ApiClient from '../ApiClient';

const ApiContext = createContext<ApiClient>(new ApiClient());

export default function ApiProvider({ children }: {children?: React.ReactNode}) {
  const api = new ApiClient();

  return (
    <ApiContext.Provider value={api}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApi() {
  return useContext(ApiContext);
}