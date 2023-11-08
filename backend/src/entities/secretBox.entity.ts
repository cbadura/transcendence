import { Column, Entity, PrimaryColumn } from "typeorm";


@Entity()
export class SecretBox {
  @PrimaryColumn({nullable: false})
  id: number;

  // @Column({nullable: false})
  // ftid: number;

  @Column()
  tempSecret: string;

  @Column({nullable: true})
  secret: string;

}