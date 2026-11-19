export const STATUS_LABELS = {
  pending: 'Menunggu Diproses',
  accepted: 'Sedang Diproses',
  rejected: 'Ditolak',
  shipped: 'Dikirim',
  completed: 'Selesai',
};

export const TAB_TO_STATUS = {
  'Menunggu Diproses': 'pending',
  'Sedang Diproses': 'accepted',
  Ditolak: 'rejected',
  Dikirim: 'shipped',
  Selesai: 'completed',
};

export function statusLabel(status) {
  if (!status) {
    return 'Diproses';
  }
  return STATUS_LABELS[String(status).toLowerCase()] || status;
}

export function statusColor(status) {
  switch (String(status || '').toLowerCase()) {
    case 'accepted':
      return '#FF9800';
    case 'shipped':
      return '#2196F3';
    case 'completed':
      return '#4CAF50';
    case 'rejected':
      return '#F44336';
    default:
      return '#FF9800';
  }
}

/**
 * Warna background badge status, senada dengan statusColor.
 */
export function statusBackground(status) {
  switch (String(status || '').toLowerCase()) {
    case 'accepted':
      return '#FFF3E0';
    case 'shipped':
      return '#E3F2FD';
    case 'completed':
      return '#E8F5E9';
    case 'rejected':
      return '#FFEBEE';
    default:
      return '#FFF3E0';
  }
}
