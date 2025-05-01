import { z } from "zod";

export const courseSchema = z
  .object({
    name: z.string().min(6, "Emri i kursit eshte i domosdoshem"),
    description: z.string().min(6, "Pershkrimi eshte i domosdoshem"),

    topicsCovered: z
      .array(z.string().min(1, "Tematika nuk mund te jete bosh"))
      .min(1, "Se paku nje tematike duhet te shtohet"),

    sectionTitles: z
      .array(z.string().min(1, "Titulli i seksionit qe permban leksione nuk mund te jete bosh"))
      .min(1, "Se paku nje seksion qe permbane leksione duhet te shtohet"),

    sectionLessons: z
      .array(z.array(z.string().min(1, "Titulli i literatures nuk mund te jete bosh")))
      .superRefine((lessons, ctx) => {
        lessons.forEach((sectionLessons, i) => {
          if (sectionLessons.length === 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Se paku nje leksion nevojitet per seksion",
              path: [i],
            });
          }
        });
      }),
  })
  .superRefine((data, ctx) => {
    if (data.sectionTitles.length !== data.sectionLessons.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Numri i seksioneve dhe leksioneve nuk përputhet",
        path: ["sectionLessons"],
      });
    }
  });
