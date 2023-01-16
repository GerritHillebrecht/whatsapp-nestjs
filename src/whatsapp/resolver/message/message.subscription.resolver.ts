import { Args, Resolver, Subscription } from '@nestjs/graphql';
import { Message } from '@whatsapp/entity';
import { MessageService } from '@whatsapp/service';

@Resolver()
export class MessageSubscriptionResolver {
  constructor(private message: MessageService) {}

  @Subscription(() => Message, {
    name: 'messageSubscription',
    filter: ({ messageSubscription: { receiver, sender } }, { receiverId }) => {
      console.log({ receiver, sender, receiverId });
      return receiver.id === receiverId || sender.id === receiverId;
    },
  })
  messageSubscription(@Args('receiverId') receiverId: number) {
    return this.message.whatsappIterator();
  }
}
