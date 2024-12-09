import winston from "winston";

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
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(
            ({timestamp, level, message}) => `${timestamp} ${level.toUpperCase()}: \n${message}`
        )
    ),
    transports: [
        new winston.transports.File({ 
            filename: "../logs/error.log",
            level: "error"
        }),
    
        new winston.transports.File({
            filename: "../logs/info.log",
            level: "info"
        }),

        new winston.transports.File({
            filename: "../logs/latex.log",
            level: "verbose"
        })
    ]
};

export const logger = winston.createLogger(logConfig);

export const generateLog = ({ position, company, start, end, description }) => {
    const cvItems = description
    .map(
      ({ text, justification_for_change }) =>
        `\n\t\tDescription: ${text}\n\t\tJustification: ${justification_for_change}`
    )
    .join("\n");
  
    return `\nPosition: ${position.replace(/^,/g, "").trim()}\nCompany: ${company.trim()}${cvItems}\n\n`;
};