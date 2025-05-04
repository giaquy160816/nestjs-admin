import { Action } from "src/enums/action.enum";
import { Category } from "src/modules/backend/category/entities/category.entity";
import { Product } from "src/modules/backend/product/entities/product.entity";
import { User } from "src/modules/backend/user/entities/user.entity";

export interface Permission {
    action: Action;
    subject: typeof Product | typeof Category | typeof User | 'all';
    fields?: [key: any];
}