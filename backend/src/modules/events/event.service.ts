import { prisma } from "../../lib/prisma.js";
import type { Prisma } from "../../generated/prisma/client.js";

import {
    findEventByExternalId,
    createEvent,
} from "./event.repository.js";

import type { CreateEventInput } from "./event.types.js";

type DatabaseClient = Prisma.TransactionClient | typeof prisma;
export const createEventService =
    async (
        data: CreateEventInput,
        db: DatabaseClient = prisma
    ) => {

        const existingEvent =
            await findEventByExternalId(
                data.applicationId,
                data.externalEventId,
                db
            );


        if (existingEvent) {
            return {
                event:
                    existingEvent,

                isDuplicate:
                    true,
            };
        }


        const event =
            await createEvent(
                data,
                db
            );


        return {
            event,

            isDuplicate:
                false,
        };
    };