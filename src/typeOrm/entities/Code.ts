import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'codes' })
export class Code {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  value: string;
}
