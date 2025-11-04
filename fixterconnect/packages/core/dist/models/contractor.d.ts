import type { Service } from './service.js';
export type Contractor = {
    id: number;
    username?: string;
    name: string;
    rating: number;
    reviewCount?: number;
    review_count?: number;
    description?: string;
    yearsInBusiness?: number;
    years_in_business?: number;
    location?: string;
    google_business_url?: string;
    services?: Service[] | Array<{
        basePrice: number | null;
        service: Service;
    }>;
    serviceAreas?: Array<{
        area: string;
        dayOfWeek: number;
    }>;
    verified?: boolean;
    licensed?: boolean;
};
export type ServiceArea = {
    id: number;
    name: string;
    selected?: boolean;
};
