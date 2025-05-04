import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from './ability/ability.factory';


@Module({
    providers: [CaslAbilityFactory],
    exports: [CaslAbilityFactory],
})
export class CaslModule { }