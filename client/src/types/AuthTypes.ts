export type User = {
  firstName: string;
  lastName: string;
  isDemoAccount: boolean;
};

export type AuthContextType = {
  authenticationStateIsLoading: boolean;
  isAuthenticated: boolean;
  userInfo: User | null;
  logout: (e: React.FormEvent<HTMLFormElement>) => void;
};
