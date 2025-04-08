import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 3000;
export const ATLAS_URI = process.env.ATLAS_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
