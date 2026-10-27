"use client";

import FormCheckout from "./formCheckout";
import CartItemComponent from "@/components/cart/CartItemComponent";
import { userCartStore } from "@/stores/userCartStore";
import { CartItem } from "@/types/cartItem";
import { useState } from "react";
import PaymentPix from "./paymentPix";
import { usePaymentPolling } from "@/hooks/usePaymentPolling";
import { CreateOrderResponse } from "@/services/checkoutService";

export default function Checkout() {
    const [paymentQrCode, setPaymentQrCode] = useState("");
    const [pixCode, setPixCode] = useState("");
    const [orderId, setOrderId] = useState<number | null>(null);
    const [purchasedItems, setPurchasedItems] = useState<CartItem[]>([]);
    
    const items = userCartStore((state) => state.items);
    const clearCart = userCartStore((state) => state.clearCart);

    const { status, isApproved, isChecking, checkNow } = usePaymentPolling({
        orderId,
        initialStatus: "Pendente",
        intervalMs: 30000,
    });

    function handleOrderCreated(order: CreateOrderResponse) {
        setOrderId(order.id);
        setPaymentQrCode(order.pix.qr_code_base64);
        setPixCode(order.pix.qr_code);
        setPurchasedItems([...items]);
        clearCart();
    }

    const displayItems = purchasedItems.length > 0 ? purchasedItems : items;
    const totalPrice = displayItems.reduce(
        (total, item) => total + item.quantity * item.price,
        0,
    );

    return (
        <main className="flex flex-wrap mt-4">
           <div className="w-full lg:w-[70%] px-8 py-4 pb-8 lg:pl-16 lg:pr-0 flex flex-col gap-6">
                <FormCheckout 
                    paymentQrCode={paymentQrCode}
                    setPaymentQrCode={setPaymentQrCode}
                    setPixCode={setPixCode}
                    onOrderCreated={handleOrderCreated}
                />

                {paymentQrCode && (
                    <PaymentPix
                        qrCodeBase64={paymentQrCode}
                        qrCodeText={pixCode}
                        orderId={orderId}
                        status={status}
                        isChecking={isChecking}
                        onCheckNow={checkNow}
                    />
                )}
            </div>
            
            <div className="hidden lg:flex w-full lg:w-[30%] px-8 py-4 lg:px-16 flex-col">                
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-primary font-bold text-2xl">Seu Pedido</h2>
                    {isApproved && (
                        <span className="text-xs bg-green-100 text-green-700 font-semibold px-2.5 py-1 rounded-full">
                            Confirmado
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    {displayItems.map((box: CartItem) => (
                        <CartItemComponent 
                            key={`${box.id}-${box.size}`} 
                            item={box} 
                            canEdit={paymentQrCode === "" && !isApproved} 
                        />
                    ))}
                </div>

                <div className="mt-2 flex justify-between py-4">
                    <h2 className="text-gray-500 text-md">Subtotal</h2>
                    <p>
                    R${" "}
                        <span className="text-2xl font-bold text-primary">
                            {totalPrice.toFixed(2).replace(".", ",")}
                        </span>
                    </p>
                </div>
            </div>
        </main>
    );
}
