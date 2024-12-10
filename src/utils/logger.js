import winston from "winston";
import path, { format } from "path";
import { fileURLToPath } from 'url';
import fs from 'fs';

// Truncate the log file
const logFilePath = '../logs/info.log';
fs.truncate(logFilePath, 0, () => {
  console.log('Log file cleared');
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logConfig = {
    level: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        verbose: 4,
        debug: 5,
        silly: 6
    },
    transports: [
        new winston.transports.File({ 
            filename: path.resolve(__dirname, "../logs/error.log"),
            level: "error",
            format: winston.format.combine(
                winston.format.errors({ stack: true }),
            )
        }),
    
        new winston.transports.File({
            filename: path.resolve(__dirname, "../logs/info.log"),
            level: "info",
            format: winston.format.combine(
                winston.format.printf(({timestamp, level, message}) => `${message}`)
            )
        }),
    ]
};

export const logger = winston.createLogger(logConfig);