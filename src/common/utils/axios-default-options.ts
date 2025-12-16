export const defaultAxiosOptions = (options?: any) => {
  return {
    timeout: 5000,
    ...options
  };
};
