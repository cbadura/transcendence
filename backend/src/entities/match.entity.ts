import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MatchUser } from "./match-user.entity";

@Entity()
export class Match{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    timestamp: Date;

    @OneToMany(()=>MatchUser,(matchUser)=>matchUser.match, {
        cascade: ['insert'],
    })
    matchUsers: MatchUser[];
}