import { ISession } from "connect-typeorm";
import { Column, DeleteDateColumn, Entity, Index, PrimaryColumn } from "typeorm";

@Entity() 
export class ESession implements ISession {
  
  @Index()
  @Column('bigint')
  expiredAt: number;
  
  @PrimaryColumn('varchar', { length: 255 })
  id: string;

  @DeleteDateColumn()
  destroyedAt?: Date;
  
  @Column('text')
  json: string;

}