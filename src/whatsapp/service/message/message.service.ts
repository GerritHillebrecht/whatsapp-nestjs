import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@user/entity';
import { UserService } from '@user/service';
import { Message } from '@whatsapp/entity';
import { Repository, In, FindManyOptions } from 'typeorm';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

type MessageQueryOptions = {
  id: number;
  limit: number;
  offset: number;
  contact?: number | number[];
};

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private userService: UserService,
  ) {}

  whatsappIterator() {
    return pubSub.asyncIterator<Message>('whatsappMessage');
  }

  publishMessage(message: Message) {
    pubSub.publish('whatsappMessage', { messageSubscription: message });
  }

  async saveMessage(body: string, receiverId: number, senderId: number) {
    const newMessage = await this.messageRepository.save({
      body,
      receiverId,
      senderId,
      isRead: false,
    });

    const message = await this.messageRepository.findOneBy({
      id: newMessage.id,
    });

    this.publishMessage(message);
    return message;
  }

  async updateMessage(id: number, body: string) {
    const updatedMessage = await this.messageRepository.update(
      { id },
      { body },
    );

    const message = await this.messageRepository.findOneBy({ id });

    this.publishMessage(message);
    return message;
  }

  async deleteMessage(id: number) {
    const message = await this.messageRepository.findOneBy({ id });
    await this.messageRepository.delete({ id });
    return message;
  }

  messagesOfContacts(queryOptions: MessageQueryOptions) {
    return this.messageRepository.find(this.queryOptions(queryOptions));
  }

  async messages(queryOptions: MessageQueryOptions): Promise<Message[]> {
    const contact = (await this.userService.getUsers(queryOptions.id)).map(
      ({ id }) => id,
    );

    return await this.messagesOfContacts({ ...queryOptions, contact });
  }

  private queryOptions({
    id,
    limit,
    offset,
    contact,
  }: MessageQueryOptions): FindManyOptions<Message> {
    const contactCriteria = typeof contact === 'number' ? contact : In(contact);
    return {
      where: [
        {
          receiverId: id,
          senderId: contactCriteria,
        },
        {
          senderId: id,
          receiverId: contactCriteria,
        },
      ],
      order: {
        createdAt: 'DESC',
      },
      take: limit,
      skip: offset,
    };
  }
}
