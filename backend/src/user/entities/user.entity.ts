import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  intraID: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  avatar: string;

  @Column('decimal',{ nullable: false, precision: 6, scale: 2})
  level: number;

  @Column({ nullable: false })
  matches: number;

  @Column({ nullable: false })
  wins: number;

  //RelationList

}
