import { z } from 'zod';

export const experienceResponse = z.object({
    experiences: z.array(
        z.object({
            position: z.string(),
            company: z.string(),
            start: z.string(),
            end: z.string(),
            description: z.array(
                z.object({
                    text: z.string(),
                    justification_for_change: z.string(),
                    is_new_suggestion: z.boolean(),
                })
            ),
        })
    ),
});

export const skillsResponse = z.object({
    category: z.array(
        z.object({
            skill: z.array(z.string),
        })
    ),
});