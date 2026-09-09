import jwt from 'jsonwebtoken';

export const generateToken = (userId) => {
  const token = jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '30d' }
  );
  return token;
};
