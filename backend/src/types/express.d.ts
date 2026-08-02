import type { UserRole } from "../../generated/prisma/enums.js";
import { ApiKey } from "../generated/prisma/client.ts";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                name: string;
                email: string;
                role: UserRole;
            };

            apiKey?: ApiKey;
        }
    }
}

export { };