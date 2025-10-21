import { useEffect, useState, type FC } from 'react';
import styles from './Toaster.module.css';

type ToastType = 'success' | 'error' | 'info' | 'warning';
type ToastVariant = 'filled' | 'outlined' | 'light-filled';

interface ToastMessage {
    id: number;
    message: string;
    type: ToastType;
    variant: ToastVariant;
}

let toastId = 0;
const toastEvents = {
    listeners: new Set<(toast: Omit<ToastMessage, 'id'>) => void>(),
    subscribe(callback: (toast: Omit<ToastMessage, 'id'>) => void) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    },
    show(message: string, type: ToastType, variant: ToastVariant = 'filled') {
        this.listeners.forEach((callback) =>
            callback({ message, type, variant }),
        );
    },
};

export const toast = {
    success: (message: string, variant?: ToastVariant) =>
        toastEvents.show(message, 'success', variant),
    error: (message: string, variant?: ToastVariant) =>
        toastEvents.show(message, 'error', variant),
    info: (message: string, variant?: ToastVariant) =>
        toastEvents.show(message, 'info', variant),
    warning: (message: string, variant?: ToastVariant) =>
        toastEvents.show(message, 'warning', variant),
};

export const Toaster: FC = () => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    useEffect(() => {
        const unsubscribe = toastEvents.subscribe(
            ({ message, type, variant }) => {
                const newToast = { id: toastId++, message, type, variant };
                setToasts((currentToasts) => [...currentToasts, newToast]);
                setTimeout(() => {
                    setToasts((currentToasts) =>
                        currentToasts.filter((t) => t.id !== newToast.id),
                    );
                }, 4000);
            },
        );
        return () => {
            unsubscribe();
        };
    }, []);

    const getToastStyle = (type: ToastType, variant: ToastVariant) => {
        const styleMap = {
            filled: {
                success: styles.toastSuccessFilled,
                error: styles.toastErrorFilled,
                info: styles.toastInfoFilled,
                warning: styles.toastWarningFilled,
            },
            outlined: {
                success: styles.toastSuccessOutlined,
                error: styles.toastErrorOutlined,
                info: styles.toastInfoOutlined,
                warning: styles.toastWarningOutlined,
            },
            'light-filled': {
                success: styles.toastSuccessLight,
                error: styles.toastErrorLight,
                info: styles.toastInfoLight,
                warning: styles.toastWarningLight,
            },
        };
        return styleMap[variant][type] || styleMap.filled.info;
    };

    return (
        <div className={styles.toasterContainer}>
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`${styles.toast} ${getToastStyle(
                        toast.type,
                        toast.variant,
                    )}`}
                >
                    {toast.message}
                </div>
            ))}
        </div>
    );
};
