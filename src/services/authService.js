// Will implement when backend is ready
export const authService = {
  login: async (email, password) => {
    return { token: 'mock-token', user: { id: 1, email, firstName: 'John' } };
  },
  register: async (userData) => {
    return { token: 'mock-token', user: { id: 1, ...userData } };
  },
  googleAuth: async (accessToken) => {
    return { token: 'mock-token', user: { id: 1, email: 'google@user.com' } };
  },
  forgotPassword: async (email) => {
    return { success: true };
  },
  resetPassword: async (token, newPassword) => {
    return { success: true };
  }
};