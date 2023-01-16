import { Injectable } from '@nestjs/common';
import { User } from '@user/entity';
import { UserService } from '@user/service';

@Injectable()
export class ContactService {
  constructor(private user: UserService) {}

  getContacts(id: number): Promise<User[]> {
    return this.user.getUsers(id);
  }

  searchContacts(searchString: string): Promise<User[]> {
    return this.user.getUsers(1);
  }
}
