import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Relationship {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    primary_user_id: number;

    @Column()
    relational_user_id: number;

    @Column()
    relationship_status: string;
}