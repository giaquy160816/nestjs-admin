import { IsBoolean, IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";
import { Length } from "class-validator";
import { Category } from "src/modules/backend/category/entities/category.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('product')
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty()
    @Length(10, 500)
    name: string;

    @Column()
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Max(10000000)
    price: number;
    
    @Column(
        {
            type: 'text',
            nullable: true,
        }
    )
    description: string;

    @Column(
        {
            type: 'text',
            nullable: true,
        }
    )
    image: string;

    @IsBoolean()
    @Column({default: true})
    isActive: boolean

    @IsString({each: true})
    @Column({
        type: 'text',
        array: true,
        default: []
    })
    album: string[];


    @CreateDateColumn({
        type: 'timestamptz',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamptz',
    })
    updatedAt: Date;

    @ManyToMany(() => Category, (category) => category.products, {cascade: true})
    @JoinTable()
    categories: Category[];
}
