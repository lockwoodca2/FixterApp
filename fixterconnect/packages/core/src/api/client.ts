import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import type { User, Client, AuthResponse } from '../models/auth.js';
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

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string = 'http://localhost:3001/api') {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Auth endpoints
  async login(username: string, password: string, userType: 'contractor' | 'client'): Promise<AuthResponse> {
    try {
      const response = await this.client.post<AuthResponse>('/login', {
        username,
        password,
        userType
      });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  }

  async createAccount(userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    username: string;
    password: string;
    accountType: 'client' | 'contractor';
    yearsExperience?: number;
    serviceAreas?: string[];
  }): Promise<{success: boolean, error?: string}> {
    try {
      const response = await this.client.post('/create-account', userData);
      return response.data;
    } catch (error) {
      console.error('Create account error:', error);
      return { success: false, error: 'Failed to create account' };
    }
  }

  // Services endpoints
  async getServices(): Promise<Service[]> {
    const response = await this.client.get<{success: boolean; services: Service[]}>('/services');
    return response.data.services || [];
  }

  async getContractorsByService(serviceId: number): Promise<Contractor[]> {
    const response = await this.client.get<{success: boolean; contractors: Contractor[]}>(`/contractors/by-service/${serviceId}`);
    return response.data.contractors || [];
  }

  async getContractor(contractorId: number): Promise<Contractor> {
    const response = await this.client.get<Contractor>(`/contractor/${contractorId}`);
    return response.data;
  }

  // Contractor services & areas
  async getContractorServices(contractorId: number): Promise<Service[]> {
    const response = await this.client.get<Service[]>(`/contractor-services/${contractorId}`);
    return response.data;
  }

  async updateContractorServices(contractorId: number, serviceIds: number[]): Promise<{success: boolean}> {
    const response = await this.client.post('/contractor/services', {
      contractorId,
      serviceIds
    });
    return response.data;
  }

  async getContractorAreas(contractorId: number): Promise<string[]> {
    const response = await this.client.get<string[]>(`/contractor-areas/${contractorId}`);
    return response.data;
  }

  async updateContractorAreas(contractorId: number, areas: string[]): Promise<{success: boolean}> {
    const response = await this.client.post('/contractor/areas', {
      contractorId,
      areas
    });
    return response.data;
  }

  // Jobs and bookings
  async getTodaysJobs(contractorId: number): Promise<Booking[]> {
    const response = await this.client.get<Booking[]>(`/todays-jobs/${contractorId}`);
    return response.data;
  }

  async getJobDetails(bookingId: number): Promise<any> {
    const response = await this.client.get(`/job-details/${bookingId}`);
    return response.data;
  }

  async getJobCompletion(bookingId: number): Promise<JobCompletion> {
    const response = await this.client.get<JobCompletion>(`/job-completion/${bookingId}`);
    return response.data;
  }

  async saveJobProgress(data: {
    bookingId: number;
    startTime?: string;
    endTime?: string;
    materials?: string;
    notes?: string;
    beforePhotos?: number;
    afterPhotos?: number;
    additionalPhotos?: number;
    audioNote?: boolean;
  }): Promise<{success: boolean, id?: number}> {
    const response = await this.client.post('/save-progress', data);
    return response.data;
  }

  async completeJob(data: {
    bookingId: number;
    startTime: string;
    endTime: string;
    materials?: string;
    notes: string;
    beforePhotos: number;
    afterPhotos: number;
    additionalPhotos?: number;
    audioNote?: boolean;
  }): Promise<{success: boolean}> {
    const response = await this.client.post('/complete-job', data);
    return response.data;
  }

  async markAsPaid(bookingId: number): Promise<{success: boolean}> {
    const response = await this.client.post(`/mark-paid/${bookingId}`, {});
    return response.data;
  }

  // Job photos
  async getJobPhotos(jobId: number): Promise<JobPhoto[]> {
    const response = await this.client.get<JobPhoto[]>(`/job-photos/${jobId}`);
    return response.data;
  }

  async uploadPhotos(jobId: number, photoType: 'before' | 'after' | 'additional', files: File[]): Promise<{success: boolean}> {
    const formData = new FormData();
    
    formData.append('jobId', jobId.toString());
    formData.append('photoType', photoType);
    
    files.forEach(file => {
      formData.append('photos', file);
    });
    
    const response = await this.client.post('/upload-photos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  }

  // Messages
  async getMessages(contractorId: number, status?: 'unread' | 'read'): Promise<Message[]> {
    let url = `/messages/${contractorId}`;
    if (status) {
      url += `?status=${status}`;
    }
    
    const response = await this.client.get<Message[]>(url);
    return response.data;
  }

  async getMessage(messageId: number): Promise<Message> {
    const response = await this.client.get<Message>(`/message/${messageId}`);
    return response.data;
  }

  async markMessageAsRead(messageId: number): Promise<{success: boolean}> {
    const response = await this.client.post(`/mark-message-read/${messageId}`, {});
    return response.data;
  }

  async getChatHistory(messageId: number): Promise<ChatMessage[]> {
    const response = await this.client.get<ChatMessage[]>(`/chat-history/${messageId}`);
    return response.data;
  }

  async sendChatMessage(messageId: number, sender: 'contractor' | 'customer', messageText: string): Promise<{success: boolean}> {
    const response = await this.client.post('/send-chat-message', {
      messageId,
      sender,
      messageText
    });
    return response.data;
  }

  // Contractor Schedule
  async getContractorSchedule(contractorId: number, startDate?: string, endDate?: string): Promise<any[]> {
    let url = `/contractor-schedule/${contractorId}`;
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    
    const response = await this.client.get(url);
    return response.data;
  }

  async addScheduleAvailability(data: {
    contractorId: number;
    date: string;
    serviceAreaId?: number;
    maxSlots?: number;
    notes?: string;
  }): Promise<{success: boolean, id?: number}> {
    const response = await this.client.post('/contractor-schedule', data);
    return response.data;
  }

  async updateScheduleAvailability(scheduleId: number, data: {
    serviceAreaId?: number;
    maxSlots?: number;
    notes?: string;
  }): Promise<{success: boolean}> {
    const response = await this.client.put(`/contractor-schedule/${scheduleId}`, data);
    return response.data;
  }

  async deleteScheduleAvailability(scheduleId: number): Promise<{success: boolean}> {
    const response = await this.client.delete(`/contractor-schedule/${scheduleId}`);
    return response.data;
  }

  // Google Business Info
  async updateGoogleInfo(contractorId: number, data: {
    googleBusinessUrl: string;
    rating: number;
    reviewCount: number;
  }): Promise<{success: boolean}> {
    const response = await this.client.post('/update-google-info', {
      contractorId,
      ...data
    });
    return response.data;
  }

  // Service Areas
  async getServiceAreas(): Promise<ServiceArea[]> {
    const response = await this.client.get<ServiceArea[]>('/service-areas');
    return response.data;
  }
}

export { ApiClient };
export default ApiClient;