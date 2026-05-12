import { z } from "zod";

const contact_number_length = Number(
  import.meta.env.VITE_CONTACT_NUMBER_LENGTH
);

export const UpdatePersonalInfoSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, { message: "Pangalan ay kailangan" })
    .refine(
      (first_name) => {
        if (first_name === "") return true;
        return /^[a-zA-Z\s]+$/.test(first_name);
      },
      {
        message: "Pangalan ay dapat mga letra lamang",
      }
    ),
  middle_name: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || /^[a-zA-Z\s]+$/.test(val), {
      message: "Gitnang pangalan ay dapat mga letra lamang",
    }),
  last_name: z
    .string()
    .trim()
    .min(1, { message: "Apelyido ay kailangan" })
    .refine(
      (last_name) => {
        if (last_name === "") return true;
        return /^[a-zA-Z\s]+$/.test(last_name);
      },
      {
        message: "Apelyido ay dapat mga letra lamang",
      }
    ),
  suffix: z
    .string()
    .transform((suffix) => (suffix === "None" ? null : suffix))
    .refine((suffix) =>
      [null, "Jr.", "Sr.", "II", "III", "IV", "V"].includes(suffix)
    )
    .or(z.literal(null))
    .optional(),
  gender: z.enum(["male", "female", "prefer not to say"], {
    message: "Hindi wasto ang kasarian",
  }),
  address: z.string().trim().min(1, { message: "Tirahan ay kailangan" }),
  contact_number: z
    .string()
    .trim()
    .length(contact_number_length, {
      message: "Numbero ng telepono ay dapat 11 na numero",
    })
    .refine((p) => !p || /^\d+$/.test(p), {
      message: "Numbero ng telepono ay dapat mga numero lamang",
    }),
  birthdate: z
    .string()
    .min(1, { message: "Kaarawan ay kailangan" })
    .refine((birthdate) => !isNaN(Date.parse(birthdate)), {
      message: "Hindi wasto ang kaarawan",
    })
    .transform((birthdate) => new Date(birthdate)),
});

export type UpdatePersonalInfoType = z.infer<typeof UpdatePersonalInfoSchema>;
