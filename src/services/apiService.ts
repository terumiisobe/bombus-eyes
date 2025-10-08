import { Colmeia, SpeciesInfo, HiveStatus, QueuedRequest } from '../types';
import { toast } from 'sonner';
import { STORAGE_KEYS } from '../utils/constants';
import { translateError, translateHttpStatus } from '../utils/errorTranslations';
import { transformApiHive, transformApiHives } from '../utils/hiveUtils';

export interface CreateHiveRequest {
  code?: number;
  species: SpeciesInfo;
  status: HiveStatus;
}

class ApiService {
  private baseUrl: string;
  private isOnline: boolean = navigator.onLine;
  private requestQueue: QueuedRequest[] = [];
  private isProcessingQueue: boolean = false;

  constructor() {
    this.baseUrl = this.getApiUrl();
    this.setupOnlineStatusListener();
    this.loadQueuedRequests();
  }

  private getApiUrl(): string {
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname === '';
    
    return isLocalhost ? 'http://localhost:8080' : 'https://bombus.onrender.com';
  }

  private setupOnlineStatusListener(): void {
    window.addEventListener('online', () => {
      console.log('🌐 Connection restored, processing queued requests...');
      this.isOnline = true;
      
      // Show connection restored toast
      if (this.requestQueue.length > 0) {
        toast.success('Conexão restaurada! Iniciando sincronização...');
      } else {
        toast.success('Conexão restaurada!');
      }
      
      this.processQueuedRequests();
    });

    window.addEventListener('offline', () => {
      console.log('📴 Connection lost');
      this.isOnline = false;
      toast.warning('Conexão perdida. As colmeias serão sincronizadas quando a conexão for restabelecida.');
    });
  }

  private loadQueuedRequests(): void {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REQUEST_QUEUE);
      if (saved) {
        this.requestQueue = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load queued requests:', error);
      this.requestQueue = [];
    }
  }

  private saveQueuedRequests(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.REQUEST_QUEUE, JSON.stringify(this.requestQueue));
    } catch (error) {
      console.error('Failed to save queued requests:', error);
    }
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async makeRequest<T>(url: string, options: RequestInit): Promise<T> {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = '';
      
      try {
        // Try to parse error message from backend
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || '';
      } catch (e) {
        // If can't parse, fallback to status text
        errorMessage = response.statusText;
      }

      // Create error with status code attached
      const error: any = new Error(errorMessage || translateHttpStatus(response.status));
      error.statusCode = response.status;
      throw error;
    }

    return response.json();
  }

  private async processQueuedRequests(): Promise<void> {
    if (this.isProcessingQueue || !this.isOnline || this.requestQueue.length === 0) {
      console.log('⏸️ Skipping queue processing:', {
        isProcessing: this.isProcessingQueue,
        isOnline: this.isOnline,
        queueLength: this.requestQueue.length
      });
      return;
    }

    console.log(`🔄 Processing ${this.requestQueue.length} queued requests...`);
    
    // Show toast for queue processing start
    if (this.requestQueue.length > 0) {
      toast.info(`Sincronizando ${this.requestQueue.length} colmeia(s) pendente(s)...`);
    }
    
    this.isProcessingQueue = true;

    while (this.requestQueue.length > 0 && this.isOnline) {
      const request = this.requestQueue[0];
      console.log(`📤 Processing request:`, request);
      
      try {
        await this.executeQueuedRequest(request);
        console.log('✅ Request processed successfully');
        
        // Show success toast based on request type
        switch (request.type) {
          case 'CREATE_HIVE':
            toast.success('Colmeia sincronizada com sucesso!');
            break;
          case 'UPDATE_HIVE':
            toast.success('Colmeia atualizada com sucesso!');
            break;
          case 'DELETE_HIVE':
            toast.success('Colmeia removida com sucesso!');
            break;
        }
        
        this.requestQueue.shift(); // Remove successful request
        this.saveQueuedRequests();
      } catch (error) {
        console.error('❌ Failed to process queued request:', error);
        
        request.retryCount++;
        
        if (request.retryCount >= request.maxRetries) {
          console.error('💀 Request failed after max retries, removing from queue:', request);
          
        // Show error toast for failed request
        const statusCode = error && typeof error === 'object' && 'statusCode' in error && typeof error.statusCode === 'number' ? error.statusCode : undefined;
        const errorMsg = error instanceof Error ? translateError(error.message, statusCode) : 'Erro desconhecido';
        switch (request.type) {
          case 'CREATE_HIVE':
            toast.error(`Falha ao sincronizar colmeia: ${errorMsg}`);
            break;
          case 'UPDATE_HIVE':
            toast.error(`Falha ao atualizar colmeia: ${errorMsg}`);
            break;
          case 'DELETE_HIVE':
            toast.error(`Falha ao remover colmeia: ${errorMsg}`);
            break;
        }
          
          this.requestQueue.shift(); // Remove failed request
          this.saveQueuedRequests();
        } else {
          console.log(`🔄 Retrying request (attempt ${request.retryCount}/${request.maxRetries})`);
          // Move to end of queue for retry
          this.requestQueue.push(this.requestQueue.shift()!);
          this.saveQueuedRequests();
          break; // Stop processing to avoid infinite loop
        }
      }
    }

    console.log(`🏁 Queue processing complete. Remaining requests: ${this.requestQueue.length}`);
    
    // Show completion toast
    if (this.requestQueue.length === 0) {
      toast.success('Todas as colmeias foram sincronizadas!');
    }
    
    this.isProcessingQueue = false;
  }

  private async executeQueuedRequest(request: QueuedRequest): Promise<void> {
    switch (request.type) {
      case 'CREATE_HIVE':
        await this.createHiveRequest(request.data);
        break;
      case 'UPDATE_HIVE':
        await this.updateHiveRequest(request.data);
        break;
      case 'DELETE_HIVE':
        await this.deleteHiveRequest(request.data);
        break;
      default:
        throw new Error(`Unknown request type: ${request.type}`);
    }
  }

  private async createHiveRequest(data: CreateHiveRequest): Promise<Colmeia> {
    console.log(`📡 POST ${this.baseUrl}/colmeias`, data);
    const response = await this.makeRequest<any>(`${this.baseUrl}/colmeias`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    console.log('📡 Raw Response:', response);
    // Transform snake_case API response to camelCase
    const transformed = transformApiHive(response);
    if (!transformed) {
      throw new Error('Failed to transform API response');
    }
    console.log('📡 Transformed Response:', transformed);
    return transformed;
  }

  private async updateHiveRequest(data: any): Promise<Colmeia> {
    const response = await this.makeRequest<any>(`${this.baseUrl}/colmeias/${data.id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    // Transform snake_case API response to camelCase
    const transformed = transformApiHive(response);
    if (!transformed) {
      throw new Error('Failed to transform API response');
    }
    return transformed;
  }

  private async deleteHiveRequest(data: { id: string }): Promise<void> {
    await this.makeRequest<void>(`${this.baseUrl}/colmeias/${data.id}`, {
      method: 'DELETE',
    });
  }

  private queueRequest(type: QueuedRequest['type'], data: any, maxRetries: number = 3): string {
    const request: QueuedRequest = {
      id: this.generateRequestId(),
      type,
      data,
      timestamp: Date.now(),
      retryCount: 0,
      maxRetries,
    };

    this.requestQueue.push(request);
    this.saveQueuedRequests();
    return request.id;
  }

  // Public API methods
  async createHive(hiveData: CreateHiveRequest): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      if (this.isOnline) {
        const response = await this.createHiveRequest(hiveData);
        return { success: true, id: response.ID };
      } else {
        const requestId = this.queueRequest('CREATE_HIVE', hiveData);
        toast.info('Colmeia adicionada offline. Será sincronizada quando a conexão for restabelecida.');
        return { success: true, id: requestId };
      }
    } catch (error) {
      const statusCode = error && typeof error === 'object' && 'statusCode' in error && typeof error.statusCode === 'number' ? error.statusCode : undefined;
      const errorMessage = error instanceof Error ? translateError(error.message, statusCode) : 'Erro desconhecido';
      return { success: false, error: errorMessage };
    }
  }

  async updateHive(hiveId: string, hiveData: any): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      if (this.isOnline) {
        const response = await this.updateHiveRequest({ id: hiveId, ...hiveData });
        return { success: true, id: response.ID };
      } else {
        const requestId = this.queueRequest('UPDATE_HIVE', { id: hiveId, ...hiveData });
        return { success: true, id: requestId };
      }
    } catch (error) {
      const statusCode = error && typeof error === 'object' && 'statusCode' in error && typeof error.statusCode === 'number' ? error.statusCode : undefined;
      const errorMessage = error instanceof Error ? translateError(error.message, statusCode) : 'Erro desconhecido';
      return { success: false, error: errorMessage };
    }
  }

  async deleteHive(hiveId: string): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      if (this.isOnline) {
        await this.deleteHiveRequest({ id: hiveId });
        return { success: true };
      } else {
        const requestId = this.queueRequest('DELETE_HIVE', { id: hiveId });
        return { success: true, id: requestId };
      }
    } catch (error) {
      const statusCode = error && typeof error === 'object' && 'statusCode' in error && typeof error.statusCode === 'number' ? error.statusCode : undefined;
      const errorMessage = error instanceof Error ? translateError(error.message, statusCode) : 'Erro desconhecido';
      return { success: false, error: errorMessage };
    }
  }

  async getHives(): Promise<{ success: boolean; data?: Colmeia[]; error?: string }> {
    try {
      const response = await this.makeRequest<any[]>(`${this.baseUrl}/colmeias`, {
        method: 'GET',
      });
      // Transform snake_case API response to camelCase
      const transformedData = transformApiHives(response);
      return { success: true, data: transformedData };
    } catch (error) {
      const statusCode = error && typeof error === 'object' && 'statusCode' in error && typeof error.statusCode === 'number' ? error.statusCode : undefined;
      const errorMessage = error instanceof Error ? translateError(error.message, statusCode) : 'Erro desconhecido';
      return { success: false, error: errorMessage };
    }
  }

  getQueuedRequestsCount(): number {
    return this.requestQueue.length;
  }

  getQueuedRequests(): QueuedRequest[] {
    return [...this.requestQueue];
  }

  clearQueuedRequests(): void {
    this.requestQueue = [];
    this.saveQueuedRequests();
  }

  isOnlineStatus(): boolean {
    return this.isOnline;
  }

  // Manual method to trigger queue processing (for testing)
  async processQueueManually(): Promise<void> {
    console.log('🔧 Manually triggering queue processing...');
    
    if (this.requestQueue.length === 0) {
      toast.info('Nenhuma colmeia pendente para sincronizar.');
      return;
    }
    
    toast.info(`Processando ${this.requestQueue.length} colmeia(s) pendente(s)...`);
    await this.processQueuedRequests();
  }

  // Show current queue status
  showQueueStatus(): void {
    const queueCount = this.requestQueue.length;
    if (queueCount === 0) {
      toast.success('Todas as colmeias estão sincronizadas!');
    } else {
      toast.info(`${queueCount} colmeia(s) aguardando sincronização.`);
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
