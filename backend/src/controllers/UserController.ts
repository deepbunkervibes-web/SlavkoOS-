import { Request, Response, NextFunction } from 'express';
import { UserService } from '@/services/UserService';
import { asyncHandler } from '@/middleware/errorHandler';

export class UserController {
  constructor(private userService: UserService) {}

  createUser = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.userService.createUser(req.body);
    res.status(201).json(result);
  });

  getUserById = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.userService.getUserById(req.params.id);
    res.json(result);
  });

  getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await this.userService.getAllUsers(page, limit);
    res.json(result);
  });

  updateUser = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.userService.updateUser(req.params.id, req.body);
    res.json(result);
  });

  deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.userService.deleteUser(req.params.id);
    res.json(result);
  });
}