import { Column, Entity, PrimaryGeneratedColumn, OneToOne, OneToMany, UpdateDateColumn, CreateDateColumn, JoinColumn } from "typeorm";
import { Profile } from "../../profile/entities/profile.entity";
import { Photo } from "../../photo/entities/photo.entity";
import { IsEmail, IsNotEmpty } from "class-validator";
import { Auth } from '../../auth/entities/auth.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fullname: string;

    @Column()
    @IsEmail()
    @IsNotEmpty()
    email: string;


    @CreateDateColumn({
        type: 'timestamp',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
    })
    updatedAt: Date;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
        default: 'user'
    })
    roles: string;

    @OneToOne(() => Profile, (profile) => profile.user)
    profile: Profile;

    @OneToMany(() => Photo, (photo) => photo.user)
    photos: Photo[];

    @OneToOne(() => Auth, (auth) => auth.user, { cascade: true })
    @JoinColumn()
    auth: Auth;
}
