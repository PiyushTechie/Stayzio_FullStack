// utils/alerts.js

export const showSuccess = (title, text = '') =>
  Swal.fire({
    icon: 'success',
    title,
    text,
    confirmButtonColor: '#fe424d',
  });

export const showError = (title, text = '') =>
  Swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonColor: '#fe424d',
  });

export const showWarning = (title, text = '') =>
  Swal.fire({
    icon: 'warning',
    title,
    text,
    showCancelButton: true,
    confirmButtonColor: '#fe424d',
    cancelButtonColor: '#fe424d',
    confirmButtonText: 'Yes',
    cancelButtonText: 'Cancel',
  });

export const showToast = (title, icon = 'success') =>
  Swal.fire({
    toast: true,
    icon,
    title,
    position: 'top-end',
    timer: 2000,
    showConfirmButton: false,
    timerProgressBar: true,
  });
