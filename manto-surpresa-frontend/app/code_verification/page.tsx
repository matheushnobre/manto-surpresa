"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Mail } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { sendEmail, verifyCode } from "@/services/otpService";

export default function CodeVerification() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("waiting-email");
    const [code, setCode] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    async function handleSubmitEmail(email: string) {
        setStatus("loading");

        try {
            await sendEmail(email);
            setStatus("waiting-code");
        } catch (error) {
            setStatus("waiting-email");
        }
        
    }

    async function handleSubmitCode(code: string) {
        setStatus("loading")
         try {
            await verifyCode(email, code);
            setStatus("ok");
        } catch (error) {
            setStatus("waiting-code");
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Ocorreu um erro inesperado. Tente novamente.");
            }
        }

    }

    return (
        <div className="flex w-full justify-center items-center px-4 py-10">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 p-6 shadow-lg sm:p-8">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-[#0E2357]">
                    Verifique seu e-mail
                    </h1>

                    <p className="mt-2 text-sm text-gray-600">
                    Precisamos confirmar sua identidade antes de liberar o acesso.
                    </p>
                </div>

                <div className="mb-6 flex items-start gap-3 rounded-xl border border-blue-100 bg-[#CDEBFD]/50 p-4">
                    <div className="mt-0.5 rounded-full bg-white p-2">
                    <Mail className="h-5 w-5 text-[#0E2357]" />
                    </div>

                    <div>
                    <p className="font-semibold text-[#0E2357]">
                        Código de verificação
                    </p>
                    <p className="mt-1 text-sm text-gray-700">
                        Enviaremos um código para seu e-mail. Digite-o abaixo para continuar.
                    </p>
                    </div>
                </div>

                {(status==="waiting-email" || status==="loading") && (
                    <form className=" flex flex-col gap-5">
                        <Field>
                            <FieldLabel htmlFor="fieldgroup-email" className="text-primary">
                                E-mail
                            </FieldLabel>
                            <Input id="fieldgroup-email" placeholder="Digite seu e-mail" className="w-full" value={email} onChange={(event) => setEmail(event.target.value)} required disabled={status === "loading"}/>
                        </Field>

                        <div className="flex w-full justify-center items-center">
                            <Button className="w-full max-w-[600px] py-4 text-md" disabled={!email || status==="loading"}  onClick={() => handleSubmitEmail(email)}>Enviar código de verificação</Button>
                        </div>

                        {(status == "loading") && (
                            <div className="flex w-full justify-center items-center">
                                <p className="text-sm text-green-500">Enviando e-mail. Aguarde um instante...</p>
                            </div>
                        )}
                    </form>
                )}

                {(status == "waiting-code") && (
                    <form className="flex flex-col gap-5">
                        <InputOTP maxLength={6} containerClassName="justify-center" value={code} onChange={setCode}>
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>

                        <div className="flex w-full justify-center items-center">
                            <Button className="w-[50%] max-w-[600px] py-4 text-md" disabled={!(code.length===6)}  onClick={() => handleSubmitCode(code)}>Enviar</Button>
                        </div>

                        <div className="flex gap-4 w-full justify-center">
                            <p>Não recebeu o e-mail?</p>
                            <button className="cursor-pointer text-bold text-primary">Reenviar</button>
                        </div>

                        {errorMessage && (
                            <div className="w-full flex items-center justify-center">
                                <p role="alert" className="text-sm text-red-500">
                                    {errorMessage}
                                </p>
                            </div>
                        )}
                        
                    </form>
                )}

                

                {(status === "ok") && (
                    <div className="w-full flex justify-center">
                        <div className="bg-primary p-4 rounded-lg">
                            <p className="text-white">Tudo ok! Redirecionando...</p>
                        </div>
                        
                    </div>
                )}

            </div>
        </div>
    )
}