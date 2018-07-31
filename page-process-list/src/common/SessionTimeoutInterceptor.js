export const sessionTimeoutInterceptor = response => {
  if (response.status === 401) {
    window.parent.location.reload();
  }
  return Promise.reject(response);
};
