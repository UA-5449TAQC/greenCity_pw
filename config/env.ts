import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });


const BASE_URL = process.env.BASE_UI_URL ;
const USER_EMAIL = process.env.USER_EMAIL;
const USER_PASSWORD = process.env.USER_PASSWORD;

export default {
    BASE_URL,
    USER_EMAIL,
    USER_PASSWORD
};