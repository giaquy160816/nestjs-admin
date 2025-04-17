import { Entity, PrimaryGeneratedColumn, Column, OneToOne, UpdateDateColumn, CreateDateColumn, JoinColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";

@Entity()
export class Profile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    avatar: string;

    @Column()
    gender: string;

    @Column({
        type: 'date',
        nullable: true,
    })
    dob: Date;

    @CreateDateColumn({
        type: 'timestamp',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
    })
    updatedAt: Date;

    @OneToOne(() => User, (user) => user.profile, {cascade: true})
    @JoinColumn()
    user: User;
}
