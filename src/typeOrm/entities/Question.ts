import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'questions' })
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  title: string;

  @Column()
  image: string;

  @Column({ type: 'text' })
  ansers: string;

  @Column()
  correct: number;

  @Column()
  explain: string;

  @Column()
  a1: boolean;

  @Column()
  a2: boolean;

  @Column()
  a3a4: boolean;

  @Column()
  b1: boolean;

  @Column()
  b2cdef: boolean;

  @Column()
  require: boolean;

  @Column()
  type: string;

  @Column({ type: 'bigint' })
  createdAt: number;
}
