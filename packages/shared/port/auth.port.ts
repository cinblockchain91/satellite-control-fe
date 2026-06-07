export interface AuthPort<TAccount> {
  login(username: string, password: string): Promise<TAccount>;
  logout(): Promise<void>;
  getMe(): Promise<TAccount>;
}
