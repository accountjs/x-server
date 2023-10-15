import { Router } from 'express';
import { AccountController } from '@controllers/account.controller';
import { Routes } from '@interfaces/routes.interface';

export class AccountRoute implements Routes {
  public path = '/account';
  public router = Router();
  public acc = new AccountController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/`, this.acc.getAddress);
    this.router.post(`${this.path}/deploy`, this.acc.deploy);
    this.router.get(`${this.path}/balance`, this.acc.balance);
    this.router.get(`${this.path}/mint`, this.acc.mint);
  }
}
