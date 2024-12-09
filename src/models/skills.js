import { z } from 'zod';

export const skillsResponse = z.object({
    category: z.array(
        z.object({
            skill: z.array(z.string),
        })
    ),
});