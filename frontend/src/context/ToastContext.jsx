import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X, Loader2 } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within a ToastProvider');
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const showToast = useCallback(({ title, message, type = 'info', duration = 5000 }) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, title, message, type, duration }]);

        if (duration !== Infinity) {
            setTimeout(() => removeToast(id), duration);
        }
        return id;
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ showToast, removeToast }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none w-full max-w-sm">
                {toasts.map((toast) => (
                    <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

const Toast = ({ title, message, type, onClose }) => {
    const icons = {
        success: <CheckCircle className="w-5 h-5 text-[var(--success)]" />,
        error: <AlertCircle className="w-5 h-5 text-[var(--error)]" />,
        info: <Info className="w-5 h-5 text-[var(--primary)]" />,
        loading: <Loader2 className="w-5 h-5 text-[var(--primary)] animate-spin" />,
    };

    const backgrounds = {
        success: 'rgba(57, 255, 20, 0.04)',
        error: 'rgba(255, 69, 58, 0.04)',
        info: 'rgba(57, 255, 20, 0.04)',
        loading: 'rgba(57, 255, 20, 0.02)',
    };

    const borders = {
        success: 'rgba(57, 255, 20, 0.2)',
        error: 'rgba(255, 69, 58, 0.2)',
        info: 'rgba(57, 255, 20, 0.2)',
        loading: 'rgba(57, 255, 20, 0.1)',
    };

    return (
        <div 
            className="pointer-events-auto animate-fade-in-right glass-card flex items-start gap-4"
            style={{ 
                padding: '1rem',
                background: backgrounds[type] || backgrounds.info,
                borderColor: borders[type] || borders.info,
                boxShadow: 'var(--shadow-lg)',
                backdropFilter: 'blur(12px)',
                width: '100%'
            }}
        >
            <div className="flex-shrink-0 mt-0.5">
                {icons[type] || icons.info}
            </div>
            
            <div className="flex-1 min-w-0">
                {title && <h4 className="text-sm font-bold text-[var(--text-primary)] mb-0.5 leading-tight">{title}</h4>}
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{message}</p>
            </div>

            <button 
                onClick={onClose}
                className="flex-shrink-0 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1 -mr-2 -mt-1"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};
