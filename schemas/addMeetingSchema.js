import {z} from "zod"

export const meetingSchema = z.object({
    title: z.string().min(6, "Titulli eshte i domosdoshem"),
    scheduledDate: z.date({
        required_error: "Data eshte e detyrueshme",
        invalid_type_error: "Duhet te jete nje date valide"
    })
})