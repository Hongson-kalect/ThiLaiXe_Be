import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'confirms' })
export class Confirm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  type: string;

  @Column()
  value: string;

  @Column({ type: 'bigint' })
  createdAt: number;
}
