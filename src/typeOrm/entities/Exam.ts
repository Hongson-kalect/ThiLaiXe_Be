import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Record } from './Record';

@Entity({ name: 'exams' })
export class Exam {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  questions: string;

  @Column()
  ansers: string;

  @Column()
  type: string;

  @Column({ type: 'bigint' })
  createdAt: number;

  @OneToMany(() => Record, (record) => record.exam)
  record: Record;
}
