import { IsBoolean, IsNotEmpty } from "class-validator";
import { Product } from "src/modules/product/entities/product.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('category')
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    @Column()
    name: string;
    

    @IsBoolean()
    @Column({default: true})
    isActive: boolean

    @CreateDateColumn({
        type: 'timestamptz',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamptz',
    })
    updatedAt: Date;
    
    @ManyToMany(() => Product, (product) => product.categories)
    products: Product[];
}
