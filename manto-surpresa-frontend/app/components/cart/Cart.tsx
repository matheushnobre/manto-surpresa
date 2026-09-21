import { userCartStore } from "@/stores/userCartStore"; 
import { CartItem } from "@/models/CartItem";
import CartItemComponent from "./CartItemComponent";

interface CartComponentProps {
    open: boolean;
    onClose: () => void;
}

export default function CartComponent({
    open,
    onClose,
}: CartComponentProps) {
    const items = userCartStore((state) => state.items);
    const totalItems = items.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = items.reduce((total, item) => total + item.quantity * item.price, 0);

    if (!open) {
        return null;
    }

    return (
        <>
            <div
                className="fixed inset-0 z-40 bg-black/50"
                onClick={onClose}
            />
            <section className="bg-white transition fixed right-0 top-0 z-50 flex h-dvh w-full flex-col shadow-xl md:w-100">
                <div className="relative flex items-center px-4 pt-6 py-4 gap-5 border-b border-gray-300">
                    <h2 className="text-primary text-2xl font-bold">
                        Seu Carrinho
                    </h2>

                    <div className="ml-auto flex gap-4 px-4">
                        <p
                            className="bg-primary rounded-full right-2 px-5 py-1 text-white"
                        >
                            { totalItems }
                        </p>

                        <button
                            className="left-2 text-primary text-2xl cursor-pointer"
                            onClick={onClose}
                        >
                            x
                        </button>
                    </div> 

                </div>

                <div className="flex flex-1 flex-col ml-2 overflow-y-auto">
                    {items.map((box: CartItem) => (
                        <CartItemComponent key={`${box.id}-${box.size}`}
                            item={box}
                        />
                    ))}
                </div>

                <div className="px-6 pb-6 mt-auto mb-4 border-t border-gray-300">
                    <div className="flex items-baseline justify-between py-4">
                        <h2 className="text-text text-lg font-bold">Subtotal</h2>
                        <p>
                            R$ <span className="text-2xl font-bold text-primary">{totalPrice.toFixed(2).replace(".", ",")}</span>
                        </p>
                    </div>

                    <button className="bg-primary w-full text-white px-2 py-4 rounded-md cursor-pointer hover:opacity-90">
                        Finalizar Compra
                    </button>
                </div>
                
            </section>
        </>
    );
}