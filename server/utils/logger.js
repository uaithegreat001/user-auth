import winston from 'winston';
console.log('LOGGER FILE LOADED FROM:', import.meta.url);

// Winston format 
const {combine, colorize, timestamp, printf, label, errors} = winston.format;


const baseFormat = combine(
    label({label: "App Logging"}),
    errors({stack: true}),
    timestamp(),
    printf(({level, message, label, timestamp, ...metadata})=> {
        const msg = typeof message === "object" ? JSON.stringify(message) : message;
        const hasExtraData = Object.keys(metadata).length > 0;
        const metadataText = hasExtraData? JSON.stringify(metadata) : "";
        return `${timestamp} ${level}: ${msg} ${metadataText}`;
    })
);

// For console error
const consoleFormat = combine(colorize(), baseFormat);

const transports = [ 
    new winston.transports.File({filename: "app.log", format: baseFormat})
]

// Run for environments
if(process.env.NODE_ENV !== "production") {
    transports.push(new winston.transports.Console({format: consoleFormat}));   
}

const logger = winston.createLogger({
        level: process.env.NODE_ENV === "production" ? "info" : "debug",
        transports,
        exceptionHandlers: [
            new winston.transports.File({filename: "exceptions.log", format: baseFormat})
        ],
        rejectionHandlers : [
            new winston.transports.File({filename: "rejections.log", format: baseFormat})
        ]
});

export default logger;