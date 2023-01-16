import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@user/entity';
import { Message } from '@whatsapp/entity';
import { Repository, In } from 'typeorm';

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
  ) {}

  async saveMessage(body: string, receiverId: number, senderId: number) {
    const newMessage = await this.messageRepository.save({
      body,
      receiverId,
      senderId,
      isRead: false,
    });
    return this.messageRepository.findOneBy({ id: newMessage.id });
  }

  updateMessage(id: number, body: string) {
    this.messageRepository.update({ id }, { body: body });
    return this.messageRepository.findOneBy({ id });
  }

  async deleteMessage(id: number) {
    const message = await this.messageRepository.findOneBy({ id });
    await this.messageRepository.delete({ id });
    return message;
  }

  messagesOfContacts({
    id,
    contact,
    limit = 100,
    offset = 0,
  }: MessageQueryOptions) {
    const contactCriteria = typeof contact === 'number' ? contact : In(contact);
    return this.messageRepository.find({
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
    });
  }

  async messages({
    id,
    limit = 100,
    offset = 0,
  }: MessageQueryOptions): Promise<Message[]> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['contacts'],
    });
    const contactIds: number[] = user.contacts.map((contact) => contact.id);

    return await this.messagesOfContacts({
      id,
      limit,
      offset,
      contact: contactIds,
    });
  }
}
