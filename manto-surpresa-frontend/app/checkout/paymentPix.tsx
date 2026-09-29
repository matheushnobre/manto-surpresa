interface PaymentPixProps {
    qrCodeBase64: string;
}

export default function PaymentPix({
    qrCodeBase64,
}: PaymentPixProps) {
    return (
        <div className="border-2 border-primary/30 rounded-lg px-5 pb-6 pt-4">
            <div className="flex justify-left">
                <h2 className="px-3 -mt-8 bg-background text-2xl font-bold text-primary">
                    Pagamento
                </h2>
            </div>

            <div className="flex flex-col items-center gap-4">
                <img
                    src={`data:image/png;base64,${qrCodeBase64}`}
                    alt="QR Code para pagamento via Pix"
                    className="w-64 h-64"
                />

                <p className="text-center">
                    Escaneie o QR Code para realizar o pagamento.
                </p>
            </div>
        </div>
    );
}