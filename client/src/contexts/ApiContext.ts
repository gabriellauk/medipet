import { createContext, useContext } from 'react';
import ApiClient from '../ApiClient';

export const ApiContext = createContext<ApiClient>(new ApiClient());

export function useApi() {
  return useContext(ApiContext);
}
