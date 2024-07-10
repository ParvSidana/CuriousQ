import { z } from "zod";

export const messageSchema = z.object({
    message : z
    .string()
    .min(10, "Message must be atleast 10 characters")
    .max(500, "Message must be atmost 500 characters")
})