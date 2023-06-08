import { Injectable } from '@joktec/core';
import { DataFactory, Seeder } from 'nestjs-seeder';
import { UserRepo } from './user.repo';
import { User } from './models';

@Injectable()
export class UserSeeder implements Seeder {
  constructor(private userRepo: UserRepo) {}

  async seed(): Promise<any> {
    const users = DataFactory.createForClass(User).generate(5);
    return Promise.all(users.map(u => this.userRepo.create(u)));
  }

  async drop(): Promise<any> {
    return this.userRepo.deleteMany({});
  }
}
