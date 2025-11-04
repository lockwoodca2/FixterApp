// In-memory database for development
// In production, you would replace this with a real database

interface User {
  id: number;
  username: string;
  password: string;
  type: 'client' | 'contractor';
}

interface Client {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
}

interface Contractor {
  id: number;
  name: string;
  rating: number;
  review_count: number;
  description?: string;
  years_in_business?: number;
  location?: string;
  google_business_url?: string;
}

export class Database {
  private users: User[] = [];
  private clients: Client[] = [];
  private contractors: Contractor[] = [];
  private nextUserId = 1;

  // User methods
  createUser(username: string, password: string, type: 'client' | 'contractor'): number {
    const id = this.nextUserId++;
    this.users.push({ id, username, password, type });
    return id;
  }

  findUserByUsername(username: string, type: 'client' | 'contractor'): User | undefined {
    return this.users.find(u => u.username === username && u.type === type);
  }

  // Client methods
  createClient(client: Client): void {
    this.clients.push(client);
  }

  getClientById(id: number): Client | undefined {
    return this.clients.find(c => c.id === id);
  }

  // Contractor methods
  createContractor(contractor: Contractor): void {
    this.contractors.push(contractor);
  }

  getContractorById(id: number): Contractor | undefined {
    return this.contractors.find(c => c.id === id);
  }
}

const db = new Database();

export function initializeDatabase() {
  console.log('In-memory database initialized');
}

export default db;
