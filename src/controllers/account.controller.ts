import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { AccountService } from '@services/account.service';

export class AccountController {
  public account = Container.get(AccountService);

  public getAddress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const salt = convertToHexBi(req.query.twitterId);
      const accountAddress: string = await this.account.address(salt);
      res.status(200).json({ data: accountAddress, message: 'account address' });
    } catch (error) {
      next(error);
    }
  };

  public deploy = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const salt = convertToHexBi(req.body.twitterId);
      // const addr = convertToHexBi(req.body.address);
      // const acc: string = await this.account.address(salt);

      const owner = req.body.newOwner; // 如何保证安全性？
      const account = await this.account.deploy(salt, owner);

      res.status(201).json({ data: account, message: 'deployed' });
    } catch (error) {
      next(error);
    }
  };

  public mint = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const hash: string = await this.account.mint();
      res.status(201).json({ data: hash, message: 'minted' });
    } catch (error) {
      next(error);
    }
  };

  public balance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const address: string = req.query.address;
      const balance: string = await this.account.balance(address);
      res.status(200).json({ data: balance, message: 'balance' });
    } catch (error) {
      next(error);
    }
  };
}

function convertToHexBi(str) {
  let hex = '';
  for (let i = 0; i < str.length; i++) {
    hex += '' + str.charCodeAt(i).toString(16);
  }
  return BigInt('0x' + hex);
}
