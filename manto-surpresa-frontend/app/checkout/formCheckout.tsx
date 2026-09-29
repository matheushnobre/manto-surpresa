"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { getAdress } from "@/services/viacepService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckoutFormSchema, checkoutFormSchema } from "../utils/zodSchema";
import { createOrder } from "@/services/checkoutService";
import { userCartStore } from "@/stores/userCartStore";

interface FormCheckoutProps {
    paymentQrCode: string;
    setPaymentQrCode: (qrCode: string) => void;
}

export default function FormCheckout({
    paymentQrCode,
    setPaymentQrCode
}: FormCheckoutProps) {  
    const { items } = userCartStore();    
    const [addressLoaded, setAddressLoaded] = useState(false);

    const {
        register, 
        handleSubmit, 
        setValue,
        formState: {errors},
    } = useForm<CheckoutFormSchema>({
        resolver: zodResolver(checkoutFormSchema),
        defaultValues: {
            name: "",
            email: "",
            telephone: "",
            cep: "",
            road: "",
            number: "",
            complement: "",
            neighborhood: "",
            city: "",
            state: ""
        }
    });

    async function onSubmit(payload: CheckoutFormSchema) {
        if (items.length === 0) return;

        try {
            const response = await createOrder({
                client: {
                    name: payload.name,
                    email: payload.email,
                    telephone: payload.telephone,
                },
                address: {
                    cep: payload.cep,
                    road: payload.road,
                    number: payload.number,
                    complement: payload.complement,
                    neighborhood: payload.neighborhood,
                    city: payload.city,
                    state: payload.state,
                },
                items: items.map((item) => ({
                    box_id: item.id,
                    quantity: item.quantity,
                    size: item.size,
                })),
            })

            setPaymentQrCode(response.pix.qr_code_base64);
        } catch (error) {
            console.log("Erro ao criar pedido", error);
        }
    }

    async function handleCepChange(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        const value = event.target.value;

        setValue("cep", value, {shouldValidate: true});

        const cleanCep = value.replace(/\D/g, "");

        if (cleanCep.length !== 8) {
            setAddressLoaded(false);
            return;
        }

        try {
            const data = await getAdress(cleanCep);

            setValue("road", data.road, {shouldValidate: true});
            setValue("neighborhood", data.neighborhood, {shouldValidate: true});
            setValue("city", data.city, {shouldValidate: true});
            setValue("state", data.state, {shouldValidate: true});

            setAddressLoaded(true);
        } catch (error) {
            console.error("Erro ao buscar CEP:", error);

            setAddressLoaded(false);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            {/* Seção de contato */}
            <fieldset className="border-2 border-primary/30 px-5 pb-6 pt-4 rounded-lg" disabled={paymentQrCode !== ""}>
                <legend className="px-3 text-2xl font-bold text-primary">
                    Contato
                </legend>

                <div className="flex flex-col gap-5">
                    <Field>
                        <FieldLabel htmlFor="fieldgroup-name" className="text-primary">Nome</FieldLabel>
                        <Input id="fieldgroup-name" placeholder="Digite seu nome" {...register("name")} aria-invalid={!!errors.name}/>
                        {errors?.name && (
                            <div className="text-red-500 text-sm">{errors?.name?.message}</div>
                        )}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="fieldgroup-email" className="text-primary">E-mail</FieldLabel>
                        <Input id="fieldgroup-email" placeholder="Digite seu e-mail" {...register("email")} aria-invalid={!!errors.email}/>
                        {errors?.email && (
                            <div className="text-red-500 text-sm">{errors?.email?.message}</div>
                        )}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="fieldgroup-telephone" className="text-primary">Telefone</FieldLabel>
                        <Input id="fieldgroup-telephone" placeholder="(92) 99999-9999" {...register("telephone")} aria-invalid={!!errors.telephone}/>
                        {errors?.telephone && (
                            <div className="text-red-500 text-sm">{errors?.telephone?.message}</div>
                        )}
                    </Field>
                </div>
            </fieldset>

            {/* Seção de endereço de entrega */}
            <fieldset className="border-2 border-primary/30 px-5 pb-6 pt-4 rounded-lg" disabled={paymentQrCode !== ""}>
                <legend className="px-3 text-2xl font-bold text-primary">
                    Dados de Entrega
                </legend>

                <div className="flex flex-col gap-5">

                    <Field>
                        <FieldLabel htmlFor="fieldgroup-cep" className="text-primary">CEP</FieldLabel>
                        <Input id="fieldgroup-cep" placeholder="99999-000" {...register("cep")} onChange={handleCepChange} aria-invalid={!!errors.cep}/>
                        {errors?.cep && (
                            <div className="text-red-500 text-sm">{errors?.cep?.message}</div>
                        )}
                    </Field>

                    {addressLoaded && (
                        <>
                            <Field>
                                <FieldLabel htmlFor="fieldgroup-road" className="text-primary">Rua</FieldLabel>
                                <Input id="fieldgroup-road" placeholder="Digite sua rua" {...register("road")} aria-invalid={!!errors.road}/>
                                {errors?.road && (
                                    <div className="text-red-500 text-sm">{errors?.road?.message}</div>
                                )}
                            </Field>
                                

                            <Field>
                                <FieldLabel htmlFor="fieldgroup-number" className="text-primary">Número</FieldLabel>
                                <Input id="fieldgroup-number" placeholder="Digite o número" {...register("number")} aria-invalid={!!errors.number}/>
                                {errors?.number && (
                                    <div className="text-red-500 text-sm">{errors?.number?.message}</div>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="fieldgroup-complement" className="text-primary">Complemento</FieldLabel>
                                <Input id="fieldgroup-complement" placeholder="Número do apartamento, bloco, etc (opcional)" {...register("complement")} aria-invalid={!!errors.complement}/>
                                {errors?.complement && (
                                    <div className="text-red-500 text-sm">{errors?.complement?.message}</div>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="fieldgroup-neighborhod" className="text-primary">Bairro</FieldLabel>
                                <Input id="fieldgroup-neighborhood" placeholder="Digite o nome do seu bairro" {...register("neighborhood")} aria-invalid={!!errors.neighborhood}/>
                                {errors?.neighborhood && (
                                    <div className="text-red-500 text-sm">{errors?.neighborhood?.message}</div>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="fieldgroup-city" className="text-primary">Cidade</FieldLabel>
                                <Input id="fieldgroup-city" placeholder="Digite o nome da sua cidade" {...register("city")} aria-invalid={!!errors.city}/>
                                {errors?.city && (
                                    <div className="text-red-500 text-sm">{errors?.city?.message}</div>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="fieldgroup-state" className="text-primary">Estado</FieldLabel>
                                <Input id="fieldgroup-state" placeholder="Digite o nome do seu estado" {...register("state")} aria-invalid={!!errors.state}/>
                                {errors?.state && (
                                    <div className="text-red-500 text-sm">{errors?.state?.message}</div>
                                )}
                            </Field>
                        </>
                    )}
                </div>
            </fieldset>
            
            {paymentQrCode === "" && (
                <div className="flex justify-center">
                    <Button type="submit" className="w-full md:w-[50%] py-5 text-md">
                        Gerar PIX para Pagamento
                    </Button>
                </div>
            )}
            
        </form>
    )
}