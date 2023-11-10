import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Profile } from './Profile';
import { Record } from './Record';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ nullable: true })
  username: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @Column({ type: 'text', nullable: true })
  token: string;

  @Column({ type: 'text', nullable: true })
  refreshToken: string;

  @Column({ type: 'bigint' })
  createdAt: number;

  @OneToOne(() => Profile)
  @JoinColumn()
  profile: Profile;

  @OneToMany(() => Record, (record) => record.user)
  record: Record[];
}
