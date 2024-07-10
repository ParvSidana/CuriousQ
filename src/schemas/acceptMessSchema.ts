import { z } from "zod";

export const acceptMessSchema = z.object({
    acceptMessages : z.boolean()
})