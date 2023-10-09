import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Achievement } from './achievement.entity';
import { MatchUser } from './match-user.entity';
import Decimal from 'decimal.js';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: false })
  avatar: string;

  @Column({ nullable: true })
  color: string

  @Column('decimal',{ nullable: false, precision: 6, scale: 2})
  level: Decimal;

  @Column({ nullable: false })
  matches: number;

  @Column({ nullable: false })
  wins: number;

  //RelationList

  @OneToMany(()=> Achievement,(Achievement)=>Achievement.owner)
  achievements: Achievement[]

  @OneToMany(()=>MatchUser, (matchUser)=>matchUser.user)
  matchHistory: MatchUser[]

}
