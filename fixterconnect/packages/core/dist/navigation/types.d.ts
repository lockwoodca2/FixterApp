export interface RouteConfig {
    path: string;
    element: React.ReactNode;
    children?: RouteConfig[];
    requireAuth?: boolean;
}
export type RootStackParamList = {
    Home: undefined;
    Services: undefined;
    ContractorsList: {
        serviceId: number;
        serviceName: string;
    };
    ContractorDetails: {
        contractorId: number;
        serviceId: number;
        serviceName: string;
    };
    ClientDashboard: undefined;
    ContractorDashboard: undefined;
    RequestQuote: {
        contractorId?: number;
        serviceId: number;
        serviceName: string;
        contractorIds?: number[];
    };
    BookService: {
        contractorId: number;
        serviceId: number;
        serviceName: string;
        contractor: any;
    };
    ServiceDetails: {
        serviceId: number;
        type?: string;
    };
    Chat: {
        messageId: number;
    };
    Login: undefined;
    Signup: undefined;
};
