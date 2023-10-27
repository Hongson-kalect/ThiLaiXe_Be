import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { Exam } from './Exam';

@Entity({ name: 'records' })
export class Record {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ansers: string;

  @Column({ type: 'float' })
  score: number;

  @Column({ type: 'float', nullable: true })
  createdAt: number;

  @ManyToOne(() => User, (user) => user.record)
  user: User;

  @ManyToOne(() => Exam, (exam) => exam.record)
  exam: Exam;
}
