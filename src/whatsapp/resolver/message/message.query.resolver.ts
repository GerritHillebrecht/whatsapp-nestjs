import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { Message } from '@whatsapp/entity';
import { MessageService } from '@whatsapp/service';

@Resolver()
export class MessageQueryResolver {
  constructor(private messageService: MessageService) {}

  @Query(() => [Message])
  messages(@Args('id') id: number) {
    return this.messageService.messages({ id, limit: 100, offset: 0 });
  }

  @Query(() => [Message])
  allMessages() {
    return this.messageService.messages({ id: 1, limit: 100, offset: 0 });
  }
}
