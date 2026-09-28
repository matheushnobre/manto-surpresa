"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { getAdress } from "@/services/viacepService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckoutFormSchema, checkoutFormSchema } from "../utils/zodSchema";

export default function FormCheckout() {  
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

    function onSubmit(payload: CheckoutFormSchema) {
        console.log('submit', payload)
    }

    async function handleCepChange(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        const value = event.target.value;

        // Mantém o CEP dentro do React Hook Form
        setValue("cep", value, {shouldValidate: true});

        const cleanCep = value.replace(/\D/g, "");

        // Ainda não temos um CEP completo
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
        <form onSubmit={handleSubmit(onSubmit)} className="w-full lg:w-[70%] px-8 py-4 lg:pl-16 lg:pr-0 flex flex-col gap-8">
            {/* Seção de contato */}
            <fieldset className="border-2 border-primary/30 px-5 pb-6 pt-4 rounded-lg">
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
            <fieldset className="border-2 border-primary/30 px-5 pb-6 pt-4 rounded-lg">
                <legend className="px-3 text-2xl font-bold text-primary">
                    Dados de Entrega
                </legend>

                <div className="flex flex-col gap-5">

                    {/* CEP */}
                    <Field>
                        <FieldLabel htmlFor="fieldgroup-cep" className="text-primary">CEP</FieldLabel>
                        <Input id="fieldgroup-cep" placeholder="99999-000" {...register("cep")} onChange={handleCepChange} aria-invalid={!!errors.cep}/>
                        {errors?.cep && (
                            <div className="text-red-500 text-sm">{errors?.cep?.message}</div>
                        )}
                    </Field>

                    {/* Campos exibidos após o CEP */}
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

            <Button type="submit" className="w-full py-5 text-md mb-4">
                Continuar para Pagamento
            </Button>
        </form>
    )
}