import { Reflector } from "@nestjs/core";
import { Permission } from "src/interface/permission";

export const Permissions = Reflector.createDecorator<Permission[]>();