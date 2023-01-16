import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from '@user/entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Message {
  @PrimaryGeneratedColumn()
  @Field((type) => Number)
  id: number;

  @Column()
  @Field((type) => String)
  body: string;

  @Column({ nullable: true })
  @Field((type) => String, { nullable: true })
  image?: string | null;

  @ManyToOne(() => User, { eager: true })
  @Field((type) => User)
  sender?: User;

  @Column()
  @Field((type) => Int, { nullable: true })
  senderId: number;

  @ManyToOne(() => User, { eager: true })
  @Field((type) => User)
  receiver?: User;

  @Column()
  @Field((type) => Int, { nullable: true })
  receiverId: number;

  @Column({ default: false })
  @Field((type) => Boolean)
  isRead: boolean;

  @Column({ default: 'delivered' })
  @Field((type) => String)
  deliveryStatus: 'pending' | 'delivered' | 'read';

  @CreateDateColumn({ type: 'timestamptz' })
  @Field((type) => Date)
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  @Field((type) => Date)
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  @Field((type) => Date, { nullable: true })
  deletedAt?: Date;
}
