import { createApplicationSchema, updateApplicationSchema } from "./application.schema.js";
import z from "zod";

export type CreateApplicationInput =
    z.infer<typeof createApplicationSchema>;

export type UpdateApplicationInput =
    z.infer<typeof updateApplicationSchema>;