import {z} from 'zod'

export const supportSectionSchema = z.object({
    subject: z.string().min(6, "Subjekti eshte i domosdoshem"),
    description: z.string().optional(),
    topicType: z.string().min(6, "Arsyja eshte e domosdoshme")
})