import { config } from "dotenv";

config();

const PORT = parseInt(process.env["PORT"] ?? "");
const DB_HOST = process.env["DB_HOST"];
const DB_PORT = parseInt(process.env["DB_PORT"] ?? "");
const DB_NAME = process.env["DB_NAME"];
const DB_USER = process.env["DB_USER"];
const DB_PASSWORD = process.env["DB_PASSWORD"];

const ACCESS_TOKEN_SECRET = process.env["ACCESS_TOKEN_SECRET"] ?? "";
const REFRESH_TOKEN_SECRET = process.env["REFRESH_TOKEN_SECRET"] ?? "";

export {
    PORT,
    DB_HOST,
    DB_NAME,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET
};

