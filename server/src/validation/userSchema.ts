import { z } from "zod";

export const userSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

declare global {
    namespace Express {
        export interface Request {
            user: {
                userId: string;
            };
        }
    }
}
