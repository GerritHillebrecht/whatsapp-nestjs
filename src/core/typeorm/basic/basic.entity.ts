import { Field, ObjectType } from '@nestjs/graphql';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
export class BasicEntity {
  @PrimaryGeneratedColumn()
  @Field((type) => Number)
  id: number;

  @Generated('uuid')
  @Field((type) => String, { nullable: true })
  uuid?: string;

  @CreateDateColumn()
  @Field((type) => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field((type) => Date)
  updatedAt: Date;

  @DeleteDateColumn()
  @Field((type) => Date, { nullable: true })
  deletedAt?: Date;
}
