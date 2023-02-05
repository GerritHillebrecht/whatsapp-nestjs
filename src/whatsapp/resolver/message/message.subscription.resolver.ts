import { Args, Resolver, Subscription } from '@nestjs/graphql';
import { Message } from '@whatsapp/entity';
import { MessageService } from '@whatsapp/service';

@Resolver()
export class MessageSubscriptionResolver {
  constructor(private message: MessageService) {}

  @Subscription(() => Message, {
    name: 'messageSubscription',
    filter: ({ messageSubscription: { receiver, sender } }, { receiverId }) =>
      [sender.id, receiver.id].includes(receiverId),
  })
  messageSubscription(@Args('receiverId') receiverId: number) {
    return this.message.whatsappMessageIterator();
  }

  @Subscription(() => [Message], {
    name: 'readupdateSubscription',
    // filter: (result, { receiverId }) => {
    //   console.log({ receiverId, messages: result.readupdateSubscription });
    //   return result.readupdateSubscription;
    // },
  })
  readupdateSubscription(@Args('receiverId') receiverId: number) {
    return this.message.whatsappReadUpdateIterator();
  }
}
