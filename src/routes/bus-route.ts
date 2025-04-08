import {FastifyInstance, FastifyReply} from "fastify";
import {AuthenticatedRequest, Route} from "../types/types";
import * as storage from "node-persist";
import { FromSchema } from "json-schema-to-ts";
import { routeSchema } from "../schemas/route";
import { Index } from "../pages/index";
import { TrackerPage } from "../pages/tracker/tracker-page.tsx";
import { render } from "preact"

import { authSchema } from "../schemas/auth";
import {readFile} from "fs/promises";

const getRouteParamsSchema = {
    type: "object",
    properties: {
        routeId: { type: "string" },
    },
    required: ["routeId"],
} as const;



interface getRouteRequestInterface extends AuthenticatedRequest {
    Params: FromSchema<typeof getRouteParamsSchema>;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function routes(fastify: FastifyInstance)  {
    const summary = "Get user details";
    fastify.get<getRouteRequestInterface>(
        "/:routeId",
        {
            schema: {
                params: getRouteParamsSchema,
                //headers: authSchema,
                response: {
                    200: routeSchema,
                    "4xx": { $ref: "errorSchema#" },
                },
            },
        },
        async (request, response: FastifyReply<getRouteRequestInterface>) => {
            const { routeId } = request.params;

            const routes = await readFile(import.meta.dirname + "/NewRoute.json")

            if (routeId == "") {
                // @ts-ignore
                return response.send(render(Index({}), null))
            }

            const routeResponse: Route = {
                id: routeId,
            };

            if (!routes.hasOwnProperty(routeId)) {
                return response.code(404).type("text/plain").send(`Route "${routeId}" is not found.`);
            }

            await storage.init();
            let bus = routes[routeId];
            let params = {
                ctu: bus.ctu || false,
                route: routeId,
                title: bus.title,
                busRunInfo: bus.runInfo,
                busHeaderImageSrc: bus.headerImageSrc,
                busHeaderImageAlt: bus.headerImageAlt,
                busTrackerBounds: bus.trackerBounds,
                busMinZoomLevel: bus.minZoomLevel,
                mapHeight: bus.mapHeight,
                color: bus.color,
                globalMarkerClass: bus.globalMarkerClass,
                stops: bus.stops,
                };
            return response.view(TrackerPage, params);
        }
    );
}
