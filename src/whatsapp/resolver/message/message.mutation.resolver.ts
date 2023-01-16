import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Message } from '@whatsapp/entity';
import { MessageService } from '@whatsapp/service';

@Resolver()
export class MessageMutationResolver {
  constructor(private messageService: MessageService) {}

  @Mutation(() => Message)
  async saveMessage(
    @Args('body') body: string,
    @Args('receiverId') receiverId: number,
    @Args('senderId') senderId: number,
  ) {
    return this.messageService.saveMessage(body, receiverId, senderId);
  }

  @Mutation(() => Message)
  async updateMessage(@Args('id') id: number, @Args('body') body: string) {
    return this.messageService.updateMessage(id, body);
  }

  @Mutation(() => Message)
  async deleteMessage(@Args('id') id: number) {
    return this.messageService.deleteMessage(id);
  }
}
