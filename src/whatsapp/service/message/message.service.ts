import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '@user/service';
import { Message } from '@whatsapp/entity';
import { Repository, In, FindManyOptions } from 'typeorm';
import { PubSub } from 'graphql-subscriptions';
import { Configuration, CreateCompletionRequest, OpenAIApi } from 'openai';

const pubSub = new PubSub();

type MessageQueryOptions = {
  id: number;
  limit: number;
  offset: number;
  contactIds: number[];
};

@Injectable()
export class MessageService {
  apiKey = process.env.OPENAI_API_KEY;
  openAiConfiguration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  openai = new OpenAIApi(this.openAiConfiguration);

  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private userService: UserService,
  ) {}

  whatsappMessageIterator() {
    return pubSub.asyncIterator<Message>('whatsappMessage');
  }

  publishMessage(message: Message) {
    pubSub.publish('whatsappMessage', { messageSubscription: message });
  }

  whatsappReadUpdateIterator() {
    return pubSub.asyncIterator<Message>('whatsappReadUpdate');
  }

  publishReadUpdate(messages: Message[]) {
    console.log('PUSBLISHING');
    pubSub.publish('whatsappReadUpdate', {
      readupdateSubscription: messages,
    });
  }

  async saveMessage(
    uuid: string,
    body: string,
    receiverId: number,
    senderId: number,
  ) {
    const newMessage = await this.messageRepository.save({
      uuid,
      body,
      receiverId,
      senderId,
      isRead: false,
    });

    const message = await this.messageRepository.findOneBy({
      id: newMessage.id,
    });

    if (message.receiver.isBot) {
      this.openAIResponse({
        userId: message.sender.id,
        prompt: message.body,
        botId: message.receiver.id,
      });
      this.updateReadStatus([message.id]);
    }

    this.publishMessage(message);
    return message;
  }

  async updateMessage(id: number, body: string) {
    await this.messageRepository.update({ id }, { body });

    const message = await this.messageRepository.findOneBy({ id });

    this.publishMessage(message);
    return message;
  }

  async updateReadStatus(Ids: number[]) {
    await this.messageRepository.update(
      { id: In(Ids) },
      { deliveryStatus: 'read' },
    );

    const messages = await this.messageRepository.find({
      where: { id: In(Ids) },
    });

    this.publishReadUpdate(messages);
    return messages.map(({ id }) => id);
  }

  async deleteMessage(id: number) {
    const message = await this.messageRepository.findOneBy({ id });
    await this.messageRepository.delete({ id });
    return message;
  }

  async messages(
    queryOptions: Omit<MessageQueryOptions, 'contactIds'>,
  ): Promise<Message[]> {
    const contactIds = (await this.userService.getUsers(queryOptions.id)).map(
      ({ id }) => id,
    );

    return this.messagesOfContacts({ ...queryOptions, contactIds });
  }

  messagesOfContacts({ contactIds, limit, offset, id }: MessageQueryOptions) {
    return Promise.all(
      contactIds.map((contactId) =>
        this.messageRepository.find(
          this.queryOptions({ id, limit, offset, contactId }),
        ),
      ),
    ).then((messages) => messages.flat());
  }

  private queryOptions({
    id,
    limit,
    offset,
    contactId,
  }: Omit<MessageQueryOptions, 'contactIds'> & {
    contactId: number;
  }): FindManyOptions<Message> {
    return {
      where: [
        {
          receiverId: id,
          senderId: contactId,
        },
        {
          senderId: id,
          receiverId: contactId,
        },
      ],
      order: {
        createdAt: 'DESC',
      },
      take: limit,
      skip: offset,
    };
  }

  private async openAIResponse({
    userId,
    prompt,
    botId,
  }: {
    userId: number;
    prompt: string;
    botId: number;
  }) {
    console.log('FETCHTING BOT RESPONSE', userId, prompt);

    const completion = await this.openai.createCompletion({
      model: 'text-davinci-003' as CreateCompletionRequest['model'],
      prompt,
      temperature: 0.6,
      max_tokens: 1000,
    } as CreateCompletionRequest);
    const response = completion.data.choices[0].text;
    console.log({ response });
    this.saveMessage(
      'BOT_RESPONSE' + new Date().getTime(),
      response,
      userId,
      botId,
    );
  }
}
