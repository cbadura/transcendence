import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Achievement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  owner_id: number;

  @Column()
  achievement_id: string;

  @Column()
  date_unlocked: Date;

}
