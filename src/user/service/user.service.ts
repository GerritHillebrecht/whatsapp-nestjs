import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@user/entity';
import { Not, Repository } from 'typeorm';

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
    return this.userRepository.find({
      where: {
        id: Not(id),
      },
      order: {
        firstName: 'ASC',
      },
    });
    // const AIBots = await this.userRepository.find({ where: { isBot: true } });
    // return this.userRepository
    //   .findOne({
    //     relations: ['contacts'],
    //     where: { id },
    //   })
    //   .then((user) => {
    //     console.log(user, user.contacts, AIBots);
    //     return [...user.contacts, ...AIBots];
    //   });
  }

  searchUsers(searchString: string): Promise<User[]> {
    return Promise.resolve([]);
  }
}
