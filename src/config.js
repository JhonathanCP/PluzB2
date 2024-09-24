import { config } from "dotenv";
config();

export const PORT = process.env.PORT || 4000;
export const SECRET = "yoursecretkey";

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@pluz.com";
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "365298";
export const EMAIL_USER = "jhonathancp31@hotmail.com"
export const EMAIL_PASSWORD = "zxcqwe159-"