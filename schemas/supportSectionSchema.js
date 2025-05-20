import {z} from 'zod'

export const supportSectionSchema = z.object({
    subject: z.string().min(6, "Subjekti eshte i domosdoshem"),
    description: z.string().optional(),
    topicType: z.string().min(6, "Arsyja eshte e domosdoshme"),
    otherTopic: z.string().optional(),
    }).superRefine((data, ctx) => {
    if (data.topicType === "tjeter" && (!data.otherTopic || data.otherTopic.trim() === "")) {
        ctx.addIssue({
        path: ["otherTopic"],
        code: z.ZodIssueCode.custom,
        message: "Ju lutem shpjegoni temën tjetër",
        });
    }
});