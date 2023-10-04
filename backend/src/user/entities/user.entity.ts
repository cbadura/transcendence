import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  color: string

  @Column('decimal',{ nullable: false, precision: 6, scale: 2})
  level: number;

  @Column({ nullable: false })
  matches: number;

  @Column({ nullable: false })
  wins: number;

  //RelationList

}
