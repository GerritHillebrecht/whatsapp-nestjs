import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { Message } from '@whatsapp/entity';
import { MessageService } from '@whatsapp/service';

@Resolver()
export class MessageQueryResolver {
  constructor(private messageService: MessageService) {}

  @Query(() => [Message])
  messages(
    @Args('id') id: number,
    @Args({ name: 'limit', type: () => Int, nullable: true }) limit = 100,
    @Args({ name: 'offset', type: () => Int, nullable: true }) offset = 0,
  ) {
    console.log({ limit, offset });
    return this.messageService.messages({ id, limit, offset });
  }
}
