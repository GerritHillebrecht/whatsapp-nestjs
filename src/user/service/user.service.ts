import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@user/entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  getUser(firebaseId: string): Promise<User> {
    return this.userRepository.findOne({ where: { firebaseId } });
  }

  async getUsers(id: number): Promise<User[]> {
    const AIBot = await this.userRepository.findOne({ where: { id: 18 } });
    return this.userRepository
      .findOne({
        relations: ['contacts'],
        where: { id },
      })
      .then((user) => [AIBot, ...user.contacts]);
  }

  searchUsers(searchString: string): Promise<User[]> {
    return Promise.resolve([]);
  }
}
