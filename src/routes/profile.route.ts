import { Router } from 'express';
import winston from 'winston';
import { ProfileController } from '../controllers/profile.controller';

export function setProfileRoutes(app: Router, logger: winston.Logger) {
  const profileController = new ProfileController(logger);
  app.post('/analyze', profileController.analyzeProfile.bind(profileController));
}

export default Router;
