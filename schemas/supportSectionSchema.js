import {z} from 'zod'

export const supportSectionSchema = z.object({
    subject: z.string().min(6, "Subjekti eshte i domosdoshem"),
    description: z.string().optional(),
    topicType: z.number().min(1, "Arsyja eshte e domosdoshme"),
    image: z
      .string()
      .regex(/^data:image\/(png|jpeg|jpg|gif);base64,/, "Formati i imazhit nuk është i vlefshëm")
      .optional()
      .or(z.literal('')),
    otherTopic: z.string().optional(),
    }).superRefine((data, ctx) => {
    if (data.topicType === 12 && (!data.otherTopic || data.otherTopic.trim() === "")) {
        ctx.addIssue({
        path: ["otherTopic"],
        code: z.ZodIssueCode.custom,
        message: "Ju lutem shpjegoni temën tjetër",
        });
    }
});