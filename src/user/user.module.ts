import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceToken, User } from './entity';
import { UserQueryResolver } from './resolver';
import { UserService } from './service';

@Module({
  imports: [TypeOrmModule.forFeature([User, DeviceToken])],
  providers: [UserService, UserQueryResolver],
})
export class UserModule {}
