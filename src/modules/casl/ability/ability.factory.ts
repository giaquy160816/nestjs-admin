import { Injectable } from "@nestjs/common";
import { Role } from "src/enums/role.enum";
import { User } from "src/modules/backend/user/entities/user.entity";
import { Category } from "src/modules/backend/category/entities/category.entity";
import { Product } from "src/modules/backend/product/entities/product.entity";
import { InferSubjects, AbilityBuilder, AbilityClass, ExtractSubjectType, Ability } from "@casl/ability";
import { Action } from "src/enums/action.enum";

type Subjects = InferSubjects<typeof Category | typeof Product | typeof User> | 'all';

export type AppAbility = Ability<[string, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
    createForUser(user: any) {
        const { can, cannot, build } = new AbilityBuilder<
            Ability<[string, Subjects]>
        >(Ability as AbilityClass<AppAbility>);

        // Convert roles string to array if it's a string
        const userRoles = typeof user.roles === 'string' ? user.roles.split(',') : user.roles;
        console.log('userRoles', userRoles);

        if (userRoles.includes(Role.ADMIN)) {
            can(Action.Manage, 'all'); // read-write access to everything
        } else {
            console.log('user', user);
            // Regular users can only access their own data
            can(Action.Read, User, { id: user.sub });
            can(Action.Update, User, { id: user.sub });
            can(Action.Delete, User, { id: user.sub });

            // Explicitly deny access to other users' data
            cannot(Action.Read, User, { id: { $ne: user.sub } });
            cannot(Action.Update, User, { id: { $ne: user.sub } });
            cannot(Action.Delete, User, { id: { $ne: user.sub } });
        }

        cannot(Action.Delete, Product, { isActive: true });

        const ability = build({
            detectSubjectType: (item) =>
                item.constructor as ExtractSubjectType<Subjects>,
        });

        return ability;
    }
}