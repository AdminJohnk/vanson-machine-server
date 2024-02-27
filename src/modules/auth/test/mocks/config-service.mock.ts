export const mockConfigService = {
  get(key: string) {
    switch (key) {
      case 'JWT_ACCESS_TOKEN_EXPIRATION_TIME':
        return '9999';
      case 'JWT_REFRESH_TOKEN_EXPIRATION_TIME':
        return '25200';
    }
  },
};
