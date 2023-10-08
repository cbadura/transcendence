import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Match } from "./match.entity";
import { User } from "./user.entity";

@Entity()
export class MatchUser{

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(()=>Match,(match)=>match.matchUsers)
    match: Match;

    @ManyToOne(()=> User,(user)=>user.matchHistory)
    user: User;

    @Column()
    score: number;

    @Column()
    outcome: boolean;
}