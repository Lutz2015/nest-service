import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { USER_STATUS } from '@app/routers/user';
import { TimeEntityBase } from './lib/time-entity-base';

@Entity()
export class User extends TimeEntityBase {
    @PrimaryGeneratedColumn('increment', { comment: 'user id' })
    id: number;

    @Column('varchar', { unique: true, length: 30, nullable: false, comment: 'username' })
    username: string;

    @Column('varchar', { nullable: false, length: 80, comment: 'password' })
    password: string;

    @Column('varchar', { nullable: false, length: 100, comment: 'email' })
    email: string;

    @Column('tinyint', { unsigned: true, nullable: false, default: USER_STATUS.NORMAL, comment: 'status' })
    status: USER_STATUS;

    @Column('varchar', { nullable: false, length: 200, comment: 'avatar' })
    avatar: string;

    @Column('tinyint', { nullable: false, unsigned: true, default: USER_STATUS.NORMAL, comment: 'super account' })
    super: USER_STATUS;
}