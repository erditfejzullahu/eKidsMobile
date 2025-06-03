import {z} from "zod"

export const registerUserSchema = z.object({
    email: z.string({
      required_error: "Emaili është i detyrueshëm",
      invalid_type_error: "Emaili duhet të jetë tekst",
    })
    .min(1, { message: "Emaili nuk mund të jetë bosh" })
    .email({ message: "Ju lutem shkruani një email valid" }),
  
    username: z.string({
      required_error: "Emri i përdoruesit është i detyrueshëm",
      invalid_type_error: "Emri i përdoruesit duhet të jetë tekst",
    })
    .min(3, { message: "Emri i përdoruesit duhet të ketë të paktën 3 karaktere" })
    .max(20, { message: "Emri i përdoruesit nuk mund të jetë më i gjatë se 20 karaktere" }),
  
    firstname: z.string({
      required_error: "Emri është i detyrueshëm",
      invalid_type_error: "Emri duhet të jetë tekst",
    })
    .min(2, { message: "Emri duhet të ketë të paktën 2 karaktere" })
    .max(50, { message: "Emri nuk mund të jetë më i gjatë se 50 karaktere" }),
  
    lastname: z.string({
      required_error: "Mbiemri është i detyrueshëm",
      invalid_type_error: "Mbiemri duhet të jetë tekst",
    })
    .min(2, { message: "Mbiemri duhet të ketë të paktën 2 karaktere" })
    .max(50, { message: "Mbiemri nuk mund të jetë më i gjatë se 50 karaktere" }),
  
    password: z.string({
      required_error: "Fjalëkalimi është i detyrueshëm",
      invalid_type_error: "Fjalëkalimi duhet të jetë tekst",
    })
    .min(8, { message: "Fjalëkalimi duhet të ketë të paktën 8 karaktere" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      { message: "Fjalëkalimi duhet të përmbajë të paktën një shkronjë të madhe, një të vogël, një numër dhe një simbol special (@$!%*?&)" }
    ),
  
    age: z.number({
      required_error: "Mosha është e detyrueshme",
      invalid_type_error: "Mosha duhet të jetë një numër",
    })
    .min(13, { message: "Mosha minimale e lejuar është 13 vjet" })
    .max(120, { message: "Mosha nuk mund të jetë më shumë se 120 vjet" }),
  
    role: z.enum(["student", "instructor"], {
      required_error: "Roli është i detyrueshëm",
      invalid_type_error: "Roli duhet të jetë 'user', 'admin' ose 'moderator'",
    }),
});

export const loginUserSchema = z.object({
    email: z.string({
        required_error: "Emaili është i detyrueshëm",
        invalid_type_error: "Emaili duhet të jetë tekst",
      })
      .min(1, { message: "Emaili nuk mund të jetë bosh" })
      .email({ message: "Ju lutem shkruani një email valid" }),
    password: z.string({
    required_error: "Fjalëkalimi është i detyrueshëm",
    invalid_type_error: "Fjalëkalimi duhet të jetë tekst",
    })
    .min(8, { message: "Fjalëkalimi duhet të ketë të paktën 8 karaktere" })
    .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    { message: "Fjalëkalimi duhet të përmbajë të paktën një shkronjë të madhe, një të vogël, një numër dhe një simbol special (@$!%*?&)" }
    ),
})