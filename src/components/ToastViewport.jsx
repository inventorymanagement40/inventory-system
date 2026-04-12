import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi'

const iconByType = {
  success: FiCheckCircle,
  error: FiAlertCircle,
  info: FiInfo,
}

export default function ToastViewport({ toasts, onDismiss }) {
  return (
    <div className="toast-viewport" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => {
        const Icon = iconByType[toast.type] ?? FiInfo

        return (
          <article key={toast.id} className={`toast-item toast-${toast.type}`}>
            <div className="toast-content">
              <Icon size={18} aria-hidden="true" />
              <p>{toast.message}</p>
            </div>
            <button
              type="button"
              className="toast-close-btn"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
            >
              <FiX size={16} aria-hidden="true" />
            </button>
          </article>
        )
      })}
    </div>
  )
}
