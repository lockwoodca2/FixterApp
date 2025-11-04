var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
class ApiClient {
    constructor(baseURL = 'http://localhost:3001/api') {
        this.client = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
    // Auth endpoints
    login(username, password, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.client.post('/login', {
                    username,
                    password,
                    userType
                });
                return response.data;
            }
            catch (error) {
                console.error('Login error:', error);
                return { success: false, error: 'Login failed' };
            }
        });
    }
    createAccount(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.client.post('/create-account', userData);
                return response.data;
            }
            catch (error) {
                console.error('Create account error:', error);
                return { success: false, error: 'Failed to create account' };
            }
        });
    }
    // Services endpoints
    getServices() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.get('/services');
            return response.data.services || [];
        });
    }
    getContractorsByService(serviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.get(`/contractors/by-service/${serviceId}`);
            return response.data.contractors || [];
        });
    }
    getContractor(contractorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.get(`/contractor/${contractorId}`);
            return response.data;
        });
    }
    // Contractor services & areas
    getContractorServices(contractorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.get(`/contractor-services/${contractorId}`);
            return response.data;
        });
    }
    updateContractorServices(contractorId, serviceIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.post('/contractor/services', {
                contractorId,
                serviceIds
            });
            return response.data;
        });
    }
    getContractorAreas(contractorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.get(`/contractor-areas/${contractorId}`);
            return response.data;
        });
    }
    updateContractorAreas(contractorId, areas) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.post('/contractor/areas', {
                contractorId,
                areas
            });
            return response.data;
        });
    }
    // Jobs and bookings
    getTodaysJobs(contractorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.get(`/todays-jobs/${contractorId}`);
            return response.data;
        });
    }
    getJobDetails(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.get(`/job-details/${bookingId}`);
            return response.data;
        });
    }
    getJobCompletion(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.get(`/job-completion/${bookingId}`);
            return response.data;
        });
    }
    saveJobProgress(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.post('/save-progress', data);
            return response.data;
        });
    }
    completeJob(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.post('/complete-job', data);
            return response.data;
        });
    }
    markAsPaid(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.post(`/mark-paid/${bookingId}`, {});
            return response.data;
        });
    }
    // Job photos
    getJobPhotos(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.get(`/job-photos/${jobId}`);
            return response.data;
        });
    }
    uploadPhotos(jobId, photoType, files) {
        return __awaiter(this, void 0, void 0, function* () {
            const formData = new FormData();
            formData.append('jobId', jobId.toString());
            formData.append('photoType', photoType);
            files.forEach(file => {
                formData.append('photos', file);
            });
            const response = yield this.client.post('/upload-photos', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        });
    }
    // Messages
    getMessages(contractorId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = `/messages/${contractorId}`;
            if (status) {
                url += `?status=${status}`;
            }
            const response = yield this.client.get(url);
            return response.data;
        });
    }
    getMessage(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.get(`/message/${messageId}`);
            return response.data;
        });
    }
    markMessageAsRead(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.post(`/mark-message-read/${messageId}`, {});
            return response.data;
        });
    }
    getChatHistory(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.get(`/chat-history/${messageId}`);
            return response.data;
        });
    }
    sendChatMessage(messageId, sender, messageText) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.post('/send-chat-message', {
                messageId,
                sender,
                messageText
            });
            return response.data;
        });
    }
    // Contractor Schedule
    getContractorSchedule(contractorId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = `/contractor-schedule/${contractorId}`;
            if (startDate && endDate) {
                url += `?startDate=${startDate}&endDate=${endDate}`;
            }
            const response = yield this.client.get(url);
            return response.data;
        });
    }
    addScheduleAvailability(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.post('/contractor-schedule', data);
            return response.data;
        });
    }
    updateScheduleAvailability(scheduleId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.put(`/contractor-schedule/${scheduleId}`, data);
            return response.data;
        });
    }
    deleteScheduleAvailability(scheduleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.delete(`/contractor-schedule/${scheduleId}`);
            return response.data;
        });
    }
    // Google Business Info
    updateGoogleInfo(contractorId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.post('/update-google-info', Object.assign({ contractorId }, data));
            return response.data;
        });
    }
    // Service Areas
    getServiceAreas() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.get('/service-areas');
            return response.data;
        });
    }
}
export { ApiClient };
export default ApiClient;
