import {z} from "zod"

export const reportSectionSchema = z.object({
    issueType: z.string().min(6, "Arsyja eshte e domosdoshme"),
    description: z.string().min(10, "Pershkrimi eshte i domosdoshem"),
    image: z
      .string()
      .regex(/^data:image\/(png|jpeg|jpg|gif);base64,/, "Formati i imazhit nuk është i vlefshëm")
      .optional(),
})