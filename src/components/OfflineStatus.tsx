import { useState, useEffect } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { WifiOff, Clock, CheckCircle, RefreshCw } from "lucide-react";
import { apiService } from "../services/apiService";
import { QueuedRequest } from "../types";

interface OfflineStatusProps {
  className?: string;
}

export function OfflineStatus({ className = "" }: OfflineStatusProps) {
  const [isOnline, setIsOnline] = useState(apiService.isOnlineStatus());
  const [queuedCount, setQueuedCount] = useState(apiService.getQueuedRequestsCount());
  const [queuedRequests, setQueuedRequests] = useState<QueuedRequest[]>([]);

  useEffect(() => {
    const updateStatus = () => {
      setIsOnline(apiService.isOnlineStatus());
      setQueuedCount(apiService.getQueuedRequestsCount());
      setQueuedRequests(apiService.getQueuedRequests());
    };

    // Update status immediately
    updateStatus();

    // Listen for online/offline changes
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    // Update queue status periodically
    const interval = setInterval(updateStatus, 2000);

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
      clearInterval(interval);
    };
  }, []);

  const getStatusIcon = () => {
    if (isOnline) {
      return queuedCount > 0 ? (
        <Clock className="w-4 h-4 text-yellow-600" />
      ) : (
        <CheckCircle className="w-4 h-4 text-green-600" />
      );
    }
    return <WifiOff className="w-4 h-4 text-orange-600" />;
  };

  const getStatusText = () => {
    if (isOnline) {
      return queuedCount > 0 ? `${queuedCount} pendente(s)` : "Sincronizado";
    }
    return "Offline";
  };

  const getStatusColor = () => {
    if (isOnline) {
      return queuedCount > 0 ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800";
    }
    return "bg-orange-100 text-orange-800";
  };

  const handleSyncClick = async () => {
    await apiService.processQueueManually();
  };

  if (queuedCount === 0 && isOnline) {
    return null; // Don't show status when everything is synced and online
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge variant="secondary" className={`flex items-center gap-1 ${getStatusColor()}`}>
        {getStatusIcon()}
        <span className="text-xs font-medium">{getStatusText()}</span>
      </Badge>
      
      {queuedCount > 0 && isOnline && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleSyncClick}
          className="h-6 px-2 text-xs"
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          Sincronizar
        </Button>
      )}
      
      {queuedCount > 0 && (
        <div className="text-xs text-gray-600">
          {queuedRequests.length > 0 && (
            <div className="text-xs">
              {queuedRequests.map((req, index) => (
                <div key={req.id} className="text-xs text-gray-500">
                  {req.type === 'CREATE_HIVE' && 'Criar colmeia'}
                  {req.type === 'UPDATE_HIVE' && 'Atualizar colmeia'}
                  {req.type === 'DELETE_HIVE' && 'Excluir colmeia'}
                  {index < queuedRequests.length - 1 && ', '}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
