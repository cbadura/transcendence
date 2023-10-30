import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Achievement } from './achievement.entity';

@Entity()
export class AchievementDefinition {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  image: string;

  @Column('json',{nullable: true})
  criteria: Record<string,any>; //can have variable amounts of key-value pairs

  @OneToMany(()=>Achievement,(achievement)=>achievement.achievementDefinition)
  achievement: Achievement[]

}
