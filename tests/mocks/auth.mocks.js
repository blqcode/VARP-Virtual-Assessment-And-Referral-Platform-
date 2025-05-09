export const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    name: 'Mock User',
    email: 'mock@example.com',
    regNumber: '111111111',
    passwordHash: '$2a$10$fakehashforpassword',
    role: 'student',
    save: jest.fn().mockResolvedValue(true)
  };
  
  export const mockUserRepository = {
    create: jest.fn().mockResolvedValue(mockUser),
    findByRegNumber: jest.fn().mockResolvedValue(mockUser),
    findById: jest.fn().mockResolvedValue(mockUser)
  };
  
  export const mockJwt = {
    generateToken: jest.fn().mockReturnValue('mock.jwt.token'),
    verifyToken: jest.fn().mockReturnValue({ id: mockUser._id })
  };