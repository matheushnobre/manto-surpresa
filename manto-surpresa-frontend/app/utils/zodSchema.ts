import { z } from "zod";

export const checkoutFormSchema = z.object({
    name: z
        .string()
        .min(1, "Digite seu nome completo"),

    email: z
        .email("Digite um e-mail válido"),

    telephone: z
        .string()
        .regex(
            /^(?:\(\d{2}\) ?\d{5}-\d{4}|\d{7}-\d{4})$/,
            "Digite um telefone válido"
        ),

    cep: z
        .string()
        .regex(/^\d{5}-?\d{3}$/, "Digite um CEP válido"),
    
    road: z
        .string()
        .min(1, "Digite sua rua"),

    number: z
        .string()
        .min(1, "Digite o número"),

    complement: z
        .string()
        .optional(),

    neighborhood: z
        .string()
        .min(1, "Digite seu bairro"),

    city: z
        .string()
        .min(1, "Digite sua cidade"),

    state: z
        .string()
        .min(1, "Digite seu estado"),
});

export type CheckoutFormSchema = z.infer<typeof checkoutFormSchema>