"use client";

import FormCheckout from "./formCheckout";
import CartItemComponent from "@/components/cart/CartItemComponent";
import { userCartStore } from "@/stores/userCartStore";
import { CartItem } from "@/types/cartItem";

export default function Checkout() {
    const items = userCartStore((state) => state.items);
    const totalPrice = items.reduce(
        (total, item) => total + item.quantity * item.price,
        0,
    );

    return (
        <main className="flex flex-wrap mt-4">
            <FormCheckout/>

            <div className="hidden lg:flex w-full lg:w-[30%] px-8 py-4 lg:px-16 flex-col">                
                <h2 className="text-primary font-bold text-2xl mb-4">Seu Pedido</h2>
                <div className="flex flex-col gap-3">
                    {items.map((box: CartItem) => (
                    <CartItemComponent key={`${box.id}-${box.size}`} item={box} />
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