import { Cloud, CloudOff, RefreshCw, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useSync } from '../../hooks/useSync';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import './SyncStatus.css';

const statusConfig = {
  synced: { icon: CheckCircle2, className: 'sync--synced', label: 'Đã đồng bộ' },
  syncing: { icon: Loader2, className: 'sync--syncing', label: 'Đang đồng bộ...' },
  pending: { icon: Cloud, className: 'sync--pending', label: 'Chưa đồng bộ' },
  offline: { icon: CloudOff, className: 'sync--offline', label: 'Ngoại tuyến' },
  error: { icon: AlertCircle, className: 'sync--error', label: 'Lỗi đồng bộ' },
  disconnected: { icon: CloudOff, className: 'sync--disconnected', label: 'Chưa kết nối GitHub' },
};

export default function SyncStatus() {
  const { syncStatus, lastSyncTime, isConnected, forceSync, error } = useSync();

  if (!isConnected && syncStatus === 'disconnected') return null;

  const config = statusConfig[syncStatus] || statusConfig.disconnected;
  const Icon = config.icon;

  return (
    <div className={`sync-status ${config.className}`}>
      <div className="sync-status__left">
        <Icon size={14} className={syncStatus === 'syncing' ? 'animate-spin' : ''} />
        <span className="sync-status__label">{config.label}</span>
        {lastSyncTime && syncStatus === 'synced' && (
          <span className="sync-status__time">
            {formatDistanceToNow(new Date(lastSyncTime), { addSuffix: true, locale: vi })}
          </span>
        )}
      </div>
      {(syncStatus === 'error' || syncStatus === 'pending') && (
        <button className="sync-status__retry" onClick={forceSync} title="Thử lại">
          <RefreshCw size={12} />
        </button>
      )}
      {error && <span className="sync-status__error-msg" title={error}>!</span>}
    </div>
  );
}
