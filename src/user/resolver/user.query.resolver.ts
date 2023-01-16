import { Args, Query, Resolver } from '@nestjs/graphql';
import { User } from '@user/entity';
import { UserService } from '@user/service';

@Resolver()
export class UserQueryResolver {
  constructor(private userService: UserService) {}

  @Query(() => User)
  async user(@Args('id') id: string) {
    return this.userService.getUser(id);
  }
}
