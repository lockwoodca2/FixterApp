export class ApiClient {
  constructor(baseURL?: string);
  login(username: string, password: string, userType: 'contractor' | 'customer'): Promise<any>;
  // ... other methods
}

export default ApiClient;