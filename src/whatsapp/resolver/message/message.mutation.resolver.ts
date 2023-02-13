import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { Message } from '@whatsapp/entity';
import { MessageService } from '@whatsapp/service';

@Resolver()
export class MessageMutationResolver {
  constructor(private messageService: MessageService) {}

  @Mutation(() => Message)
  async saveMessage(
    @Args('uuid') uuid: string,
    @Args('body') body: string,
    @Args('receiverId') receiverId: number,
    @Args('senderId') senderId: number,
    @Args('image') image: string | null,
  ) {
    return this.messageService.saveMessage(
      uuid,
      body,
      receiverId,
      senderId,
      image,
    );
  }

  @Mutation(() => Message)
  async updateMessage(@Args('id') id: number, @Args('body') body: string) {
    return this.messageService.updateMessage(id, body);
  }

  @Mutation(() => [Int])
  async updateReadStatus(
    @Args({ name: 'messageIds', type: () => [Int] }) messageIds: number[],
  ) {
    return this.messageService.updateReadStatus(messageIds);
  }

  @Mutation(() => Message)
  async deleteMessage(@Args('id') id: number) {
    return this.messageService.deleteMessage(id);
  }
}
