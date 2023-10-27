import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'profiles' })
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  date_of_birth: string;

  @Column()
  place_of_birth: string;

  @Column()
  phone: string;

  @Column()
  address: string;
}
