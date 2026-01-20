/**
 * NOTIFICATIONS UTILITY
 * Gestisce messaggi di notifica per l'utente
 */

export type NotificationType = 'info' | 'warning' | 'error' | 'success';

/**
 * Mostra un messaggio di notifica temporaneo
 */
export const showNotification = (message: string, type: NotificationType = 'info', duration: number = 3000): void => {
  // Rimuovi notifiche esistenti
  const existingToast = document.getElementById('app-toast-notification');
  if (existingToast) {
    existingToast.remove();
  }

  // Crea elemento notifica
  const toast = document.createElement('div');
  toast.id = 'app-toast-notification';
  toast.textContent = message;
  
  // Stili base
  Object.assign(toast.style, {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '16px 24px',
    borderRadius: '8px',
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '14px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: '10000',
    animation: 'slideDown 0.3s ease-out',
    maxWidth: '90%',
    textAlign: 'center',
  });

  // Colori in base al tipo
  const colors = {
    info: '#0d6efd',
    warning: '#ffc107',
    error: '#dc3545',
    success: '#28a745',
  };
  toast.style.backgroundColor = colors[type] || colors.info;

  // Aggiungi animazione CSS
  if (!document.getElementById('toast-animation-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-animation-styles';
    style.textContent = `
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateX(-50%) translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      }
      @keyframes slideUp {
        from {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
        to {
          opacity: 0;
          transform: translateX(-50%) translateY(-20px);
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Aggiungi al DOM
  document.body.appendChild(toast);

  // Rimuovi dopo il duration
  setTimeout(() => {
    toast.style.animation = 'slideUp 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  }, duration);
};

