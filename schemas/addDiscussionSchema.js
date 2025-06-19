import {z} from "zod"

export const addDiscussionSchema = z.object({
    title: z.string({
        required_error: "Titulli është i detyrueshëm",
        invalid_type_error: "Titulli duhet të jetë tekst"
    }).min(1, {
        message: "Titulli nuk mund të jetë bosh"
    }),
    tags: z.string({
        required_error: "Etiketimet janë të detyrueshme",
        invalid_type_error: "Etiketimet duhet të jenë tekst"
    }).min(2, {
        message: "Duhet të vendosni të paktën një etiketim"
    })
})