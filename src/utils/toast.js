// src/utils/toast.js
import toast from 'react-hot-toast';

export const toastSuccess = (message) => toast.success(message);
export const toastError = (message) => toast.error(message);
export const toastLoading = (message) => toast.loading(message);
export const toastDismiss = (id) => toast.dismiss(id);