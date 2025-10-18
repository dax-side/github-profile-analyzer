import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import winston from 'winston';
import { setProfileRoutes } from './routes/profile.route';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Setup Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

// Morgan for HTTP logging
app.use(morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim()),
  },
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setProfileRoutes(app, logger);

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});