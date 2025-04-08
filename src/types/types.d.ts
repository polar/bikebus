import { RequestGenericInterface } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { userSchema } from "../schemas/user";
import { routeSchema } from "../schemas/route";

export type Route = FromSchema<typeof routeSchema>;
export type User = FromSchema<typeof userSchema>;

export interface AuthenticatedRequest extends RequestGenericInterface {
    Headers: {
        authorization: string;
    };
}

declare module "fastify-jsxmin" {}
