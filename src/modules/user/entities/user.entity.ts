import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, UpdateDateColumn, CreateDateColumn } from "typeorm";
import { Profile } from "../../profile/entities/profile.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fullname: string;

    @Column()
    email: string;

    @Column({
        nullable: true,
    })
    password: string;

    @CreateDateColumn({
            type: 'timestamptz',
        })
    createdAt: Date;

    @UpdateDateColumn({
            type: 'timestamptz',
        })
    updatedAt: Date;

    @OneToOne(() => Profile, (profile) => profile.user)
    profile: Profile;
}