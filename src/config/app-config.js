import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = () => {
    const MODE = process.env.NODE_ENV || 'production';

    const config = {
        test: {
            MODE: 'test',
            PORT: Number(process.env.PORT),
            PUBLIC_PATH: path.resolve('public'),
            SESSION_COOKIE: process.env.SESSION_COOKIE,
            API_KEY: process.env.API_KEY,
            PWD_ENCR: process.env.PWD_ENCR,
            SECRET: process.env.SECRET,
            db:{
                HOST: process.env.DB_HOST,
                NAME: process.env.DB_NAME,
                USER: process.env.DB_USER,
                PWD: process.env.DB_PWD,
                PORT: Number(process.env.DB_PORT)
            }
        },
        production: {
            MODE: 'production',
            PORT: Number(process.env.PORT),
            PUBLIC_PATH: path.resolve('public'),
            SESSION_COOKIE: process.env.SESSION_COOKIE,
            API_KEY: process.env.API_KEY,
            PWD_ENCR: process.env.PWD_ENCR,
            SECRET: process.env.SECRET,
            db:{
                HOST: process.env.DB_HOST,
                NAME: process.env.DB_NAME,
                USER: process.env.DB_USER,
                PWD: process.env.DB_PWD,
                PORT: Number(process.env.DB_PORT)
            }
        },
        development: {
            MODE: 'development',
            PORT: Number(process.env.PORT),
            PUBLIC_PATH: path.resolve('public'),
            SESSION_COOKIE: process.env.SESSION_COOKIE,
            API_KEY: process.env.API_KEY,
            PWD_ENCR: process.env.PWD_ENCR,
            SECRET: process.env.SECRET,
            db:{
                HOST: process.env.DB_HOST,
                NAME: process.env.DB_NAME,
                USER: process.env.DB_USER,
                PWD: process.env.DB_PWD,
                PORT: Number(process.env.DB_PORT)
            }
        }
    };

    return config[MODE];
}