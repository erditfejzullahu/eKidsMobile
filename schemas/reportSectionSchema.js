import {z} from "zod"

export const reportSectionSchema = z.object({
    issueType: z.number().min(6, "Arsyja eshte e domosdoshme"),
    description: z.string().min(10, "Pershkrimi eshte i domosdoshem"),
    image: z
      .string()
      .regex(/^data:image\/(png|jpeg|jpg|gif);base64,/, "Formati i imazhit nuk është i vlefshëm")
      .optional(),
    otherTopic: z.string().optional(),
    }).superRefine((data, ctx) => {
    if (data.issueType === 25 && (!data.otherTopic || data.otherTopic.trim() === "")) {
        ctx.addIssue({
        path: ["otherTopic"],
        code: z.ZodIssueCode.custom,
        message: "Ju lutem shpjegoni temën tjetër",
        });
    }
});