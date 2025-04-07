import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fullName: string;

    @Column({
        type: 'date',
        nullable: true,
    })
    dob: Date;

    @Column({
        type: 'enum',
        enum: ['male', 'female'],
        nullable: true,
    })
    gender: string;

    @Column()
    email: string;

    @Column({
        nullable: true,
    })
    password: string;

    @Column({
            type: 'timestamptz',
            default: () => 'CURRENT_TIMESTAMP',
        })
    createdAt: Date;

    @Column({
            type: 'timestamptz',
            default: () => 'CURRENT_TIMESTAMP',
        })
    updatedAt: Date;
    
}