import type { AuthResponse } from '../models/auth.js';
import type { Booking, JobCompletion } from '../models/booking.js';
import type { Contractor, ServiceArea } from '../models/contractor.js';
import type { Message, ChatMessage } from '../models/message.js';
import type { Service } from '../models/service.js';
interface JobPhoto {
    id: number;
    job_id: number;
    photo_url: string;
    type: 'before' | 'after' | 'additional';
    created_at: string;
}
declare class ApiClient {
    private client;
    constructor(baseURL?: string);
    login(username: string, password: string, userType: 'contractor' | 'client'): Promise<AuthResponse>;
    createAccount(userData: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        username: string;
        password: string;
        accountType: 'client' | 'contractor';
        yearsExperience?: number;
        serviceAreas?: string[];
    }): Promise<{
        success: boolean;
        error?: string;
    }>;
    getServices(): Promise<Service[]>;
    getContractorsByService(serviceId: number): Promise<Contractor[]>;
    getContractor(contractorId: number): Promise<Contractor>;
    getContractorServices(contractorId: number): Promise<Service[]>;
    updateContractorServices(contractorId: number, serviceIds: number[]): Promise<{
        success: boolean;
    }>;
    getContractorAreas(contractorId: number): Promise<string[]>;
    updateContractorAreas(contractorId: number, areas: string[]): Promise<{
        success: boolean;
    }>;
    getTodaysJobs(contractorId: number): Promise<Booking[]>;
    getJobDetails(bookingId: number): Promise<any>;
    getJobCompletion(bookingId: number): Promise<JobCompletion>;
    saveJobProgress(data: {
        bookingId: number;
        startTime?: string;
        endTime?: string;
        materials?: string;
        notes?: string;
        beforePhotos?: number;
        afterPhotos?: number;
        additionalPhotos?: number;
        audioNote?: boolean;
    }): Promise<{
        success: boolean;
        id?: number;
    }>;
    completeJob(data: {
        bookingId: number;
        startTime: string;
        endTime: string;
        materials?: string;
        notes: string;
        beforePhotos: number;
        afterPhotos: number;
        additionalPhotos?: number;
        audioNote?: boolean;
    }): Promise<{
        success: boolean;
    }>;
    markAsPaid(bookingId: number): Promise<{
        success: boolean;
    }>;
    getJobPhotos(jobId: number): Promise<JobPhoto[]>;
    uploadPhotos(jobId: number, photoType: 'before' | 'after' | 'additional', files: File[]): Promise<{
        success: boolean;
    }>;
    getMessages(contractorId: number, status?: 'unread' | 'read'): Promise<Message[]>;
    getMessage(messageId: number): Promise<Message>;
    markMessageAsRead(messageId: number): Promise<{
        success: boolean;
    }>;
    getChatHistory(messageId: number): Promise<ChatMessage[]>;
    sendChatMessage(messageId: number, sender: 'contractor' | 'customer', messageText: string): Promise<{
        success: boolean;
    }>;
    getContractorSchedule(contractorId: number, startDate?: string, endDate?: string): Promise<any[]>;
    addScheduleAvailability(data: {
        contractorId: number;
        date: string;
        serviceAreaId?: number;
        maxSlots?: number;
        notes?: string;
    }): Promise<{
        success: boolean;
        id?: number;
    }>;
    updateScheduleAvailability(scheduleId: number, data: {
        serviceAreaId?: number;
        maxSlots?: number;
        notes?: string;
    }): Promise<{
        success: boolean;
    }>;
    deleteScheduleAvailability(scheduleId: number): Promise<{
        success: boolean;
    }>;
    updateGoogleInfo(contractorId: number, data: {
        googleBusinessUrl: string;
        rating: number;
        reviewCount: number;
    }): Promise<{
        success: boolean;
    }>;
    getServiceAreas(): Promise<ServiceArea[]>;
}
export { ApiClient };
export default ApiClient;
