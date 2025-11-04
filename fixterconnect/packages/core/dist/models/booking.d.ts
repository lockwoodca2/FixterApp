export type Booking = {
    id: number;
    contractor_id: number;
    client_name: string;
    client_phone: string;
    client_email?: string;
    service_name: string;
    service_address: string;
    scheduled_date: string;
    scheduled_time: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    created_at: string;
    completion_id?: number;
    payment_received?: boolean;
};
export type JobCompletion = {
    id: number;
    booking_id: number;
    start_time?: string;
    end_time?: string;
    materials?: string;
    notes?: string;
    before_photos?: number;
    after_photos?: number;
    additional_photos?: number;
    audio_note?: boolean;
};
export interface JobPhoto {
    id: number;
    booking_id: number;
    filename: string;
    original_name: string;
    photo_type: 'before' | 'after' | 'additional';
    file_size: number;
    created_at: string;
}
