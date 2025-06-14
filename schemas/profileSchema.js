import {z} from "zod"

export const personalInformations = z.object({
    name: z.string()
        .min(3, "Emri duhet të ketë të paktën 3 karaktere")
        .max(50, "Emri nuk mund të jetë më i gjatë se 50 karaktere"),
    lastname: z.string()
        .min(3, "Mbiemri duhet të ketë të paktën 3 karaktere")
        .max(50, "Mbiemri nuk mund të jetë më i gjatë se 50 karaktere"),
    username: z.string()
        .min(3, "Emri i përdoruesit duhet të ketë të paktën 3 karaktere")
        .max(20, "Emri i përdoruesit nuk mund të jetë më i gjatë se 20 karaktere")
        .regex(/^[a-zA-Z0-9_]+$/, "Emri i përdoruesit mund të përmbajë vetëm shkronja, numra dhe underscore (_)"),
    email: z.string()
        .min(1, "Emaili është i detyrueshëm")
        .email("Ju lutem shkruani një email valid"),
    phoneNumber: z.string()
        .min(1, "Numri i telefonit është i detyrueshëm")
        .regex(/^\+?[0-9\s\-]+$/, "Ju lutem shkruani një numër telefoni valid")
        .transform(val => val.replace(/[\s\-]/g, '')), // Remove spaces and dashes
    password: z.string()
        .min(8, "Fjalëkalimi duhet të ketë të paktën 8 karaktere")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/,
            { message: "Fjalëkalimi duhet të përmbajë të paktën një shkronjë të vogël, një të madhe, një numër dhe një karakter special (@$!%*?&.)" }
        )
        .optional(),
    confirmPassword: z.string().optional()
}).refine(data => {
    // Only validate if password exists (user wants to change it)
    if (data.password) {
        return data.password === data.confirmPassword;
    }
    return true;
}, {
    message: "Fjalëkalimet nuk përputhen",
    path: ["confirmPassword"] // Show error on confirmPassword field
});

