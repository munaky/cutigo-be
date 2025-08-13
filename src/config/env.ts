import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export const env: any = {
    ...process.env,
    CORS_ORIGINS: process.env.CORS_ORIGINS?.split(',')
}