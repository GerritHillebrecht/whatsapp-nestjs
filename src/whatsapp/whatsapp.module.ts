import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@user/entity';
import { Message } from './entity';
import { MessageQueryResolver, ContactQueryResolver } from './resolver';
import { UserService } from '@user/service';
import { MessageService, ContactService } from './service';
import {
  MessageMutationResolver,
  MessageSubscriptionResolver,
} from './resolver/message';

@Module({
  imports: [TypeOrmModule.forFeature([User, Message])],
  providers: [
    UserService,
    ContactService,
    MessageService,

    MessageQueryResolver,
    MessageSubscriptionResolver,
    MessageMutationResolver,

    ContactQueryResolver,
  ],
})
export class WhatsappModule {}
