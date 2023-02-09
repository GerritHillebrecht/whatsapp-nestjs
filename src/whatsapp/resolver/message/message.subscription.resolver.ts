import { Args, Resolver, Subscription } from '@nestjs/graphql';
import { Message } from '@whatsapp/entity';
import { MessageService } from '@whatsapp/service';

@Resolver()
export class MessageSubscriptionResolver {
  constructor(private message: MessageService) {}

  @Subscription(() => Message, {
    name: 'messageSubscription',
    filter: ({ messageSubscription: { receiver, sender } }, { id }) => {
      return [sender.id, receiver.id].includes(id);
    },
  })
  messageSubscription(@Args('id') id: number) {
    return this.message.whatsappMessageIterator();
  }

  @Subscription(() => [Message], {
    name: 'readupdateSubscription',
    filter: ({ readupdateSubscription: messages }, { id }) => {
      return messages.filter(({ sender, receiver }) =>
        [sender.id, receiver.id].includes(id),
      );
    },
  })
  readupdateSubscription(@Args('id') id: number) {
    return this.message.whatsappReadUpdateIterator();
  }
}
