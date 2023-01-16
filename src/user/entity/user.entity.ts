import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { DeviceToken } from './deviceToken.entity';
import { BasicEntity } from '@core/typeorm/basic';

enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Entity()
@ObjectType()
export class User extends BasicEntity {
  @Column({ nullable: true })
  firebaseId: string;

  @Column()
  @Field((type) => String)
  username: string;

  @Column()
  @Field((type) => String)
  firstName: string;

  @Column()
  @Field((type) => String)
  lastName: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  @Field((type) => String, { nullable: true })
  role?: UserRole;

  @Column({ nullable: true })
  @Field((type) => String, { nullable: true })
  image?: string | null;

  @Column()
  @Field((type) => String)
  email: string;

  @Column({ type: 'boolean', default: false })
  @Field((type) => Boolean)
  isBot: boolean;

  @ManyToMany(() => User)
  @JoinTable()
  @Field((type) => [User], { nullable: true })
  contacts?: User[];

  @OneToMany(() => DeviceToken, (deviceToken) => deviceToken.userId)
  @Field((type) => [DeviceToken], { nullable: true })
  deviceToken?: DeviceToken[];
}
