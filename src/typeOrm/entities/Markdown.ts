import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'markdowns' })
export class Markdown {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column({ type: 'text' })
  value: string;
}
