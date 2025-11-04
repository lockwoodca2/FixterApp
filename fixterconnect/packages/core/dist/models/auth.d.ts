import type { Contractor } from './contractor.js';
export type User = {
    id: number;
    username: string;
    type: 'client' | 'contractor';
};
export type Client = User & {
    type: 'client';
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
};
export type AuthResponse = {
    success: boolean;
    error?: string;
} & ({
    success: true;
    contractor?: Contractor;
    client?: never;
} | {
    success: true;
    client?: Client;
    contractor?: never;
} | {
    success: false;
    contractor?: never;
    client?: never;
});
