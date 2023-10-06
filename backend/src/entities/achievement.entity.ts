import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { AchievementDefinition } from './achievement-definition.entity';

@Entity()
export class Achievement {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(()=> User,(user)=>user.achievements)
  owner: User;

  @ManyToOne(()=>AchievementDefinition,(achievementDev)=>achievementDev.id)
  achievementDefinition: AchievementDefinition;

  @Column()
  date_unlocked: Date;

}
