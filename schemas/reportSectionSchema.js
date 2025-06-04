import {z} from "zod"

export const reportSectionSchema = z.object({
    issueType: z.number().min(6, "Arsyja eshte e domosdoshme"),
    description: z.string().min(10, "Pershkrimi eshte i domosdoshem"),
    image: z
      .string()
      .regex(/^data:image\/(png|jpeg|jpg|gif);base64,/, "Formati i imazhit nuk është i vlefshëm")
      .optional()
      .or(z.literal('')),
    otherTopic: z.string().optional(),
    reportUser: z.string().optional(),
    }).superRefine((data, ctx) => {
    if (data.issueType === 25 && (!data.otherTopic || data.otherTopic.trim() === "")) {
        ctx.addIssue({
        path: ["otherTopic"],
        code: z.ZodIssueCode.custom,
        message: "Ju lutem shpjegoni temën tjetër",
        });
    } else if(data.issueType === 17 || data.issueType === 16){
      ctx.addIssue({
        path: ["reportUser"],
        code: z.ZodIssueCode.custom,
        message: "Ju lutem paraqitni perdoruesin per raportim"
      })
      ctx.addIssue({
        path: ["otherTopic"],
        code: z.ZodIssueCode.custom,
        message: "Shpjegoni arsyjen e raportimit te perdoruesit ne fjale"
      })
    }
});