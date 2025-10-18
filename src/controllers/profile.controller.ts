import { Request, Response } from 'express';
import winston from 'winston';
import { GitHubService } from '../services/github.service';

export class ProfileController {
  private logger: winston.Logger;

  constructor(logger: winston.Logger) {
    this.logger = logger;
  }

  /**
   * Analyzes a GitHub profile and returns insights.
   * @param req Express request object
   * @param res Express response object
   */
  public analyzeProfile = async (req: Request, res: Response): Promise<void> => {
    const { username, token } = req.body;

    // Input validation
    if (!username || typeof username !== 'string' || username.trim().length === 0) {
      this.logger.warn('Invalid username provided', { username });
      res.status(400).json({ error: 'Username is required and must be a non-empty string' });
      return;
    }

    const trimmedUsername = username.trim();
    if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(trimmedUsername)) {
      this.logger.warn('Invalid GitHub username format', { username: trimmedUsername });
      res.status(400).json({ error: 'Invalid GitHub username format' });
      return;
    }

    this.logger.info('Starting profile analysis', { username: trimmedUsername });

    try {
      const githubService = new GitHubService(trimmedUsername, token, this.logger);
      const analysisResults = await githubService.analyzeProfile();
      this.logger.info('Profile analysis completed successfully', { username: trimmedUsername });
      res.status(200).json(analysisResults);
    } catch (error) {
      this.logger.error('Profile analysis failed', {
        username: trimmedUsername,
        error: (error as Error).message,
      });
      if ((error as any).response?.status === 403) {
        res.status(429).json({
          error: 'GitHub API rate limit exceeded. Please provide a personal access token.',
        });
      } else if ((error as any).response?.status === 404) {
        res.status(404).json({ error: 'GitHub user not found' });
      } else {
        res.status(500).json({ error: 'An error occurred while analyzing the profile' });
      }
    }
  };
}
