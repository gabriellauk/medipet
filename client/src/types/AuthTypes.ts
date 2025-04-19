export type User = {
  firstName: string;
  lastName: string;
};

export type AuthContextType = {
  authenticationStateIsLoading: boolean;
  isAuthenticated: boolean;
  userInfo: User | null;
  logout: (e: React.FormEvent<HTMLFormElement>) => void;
};
