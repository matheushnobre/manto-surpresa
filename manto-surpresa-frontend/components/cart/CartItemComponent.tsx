import Image from "next/image";
import { Trash } from "lucide-react";
import { userCartStore } from "@/stores/userCartStore";
import { CartItem } from "@/types/CartItem";

interface CartItemComponentProps {
  item: CartItem;
}

export default function CartItemComponent({ item }: CartItemComponentProps) {
  const changeQuantity = userCartStore((state) => state.changeQuantity);
  const removeItem = userCartStore((state) => state.removeItem);

  return (
    <div className="flex w-full h-42 gap-4 bg-white px-2 py-4 pr-4 border-b border-gray-200">
      <div className="mt-1 relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
        <Image
          src={`/assets${item.image}`}
          alt={item.name}
          fill
          className="border border-gray-600 rounded-lg"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <h2 className="truncate font-bold text-primary text-lg">{item.name}</h2>

        <p className="text-sm text-gray-500">Tamanho: {item.size}</p>

        <span className="font-bold text-primary text-md mt-3">
          R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
        </span>

        <div className="flex items-center gap-3 mt-1">
          <button
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-secondary text-sm font-semibold text-primary transition hover:opacity-80"
            onClick={() => changeQuantity(item, -1)}
          >
            −
          </button>

          <p className="w-4 text-center text-md font-medium">{item.quantity}</p>

          <button
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-primary text-sm font-semibold text-white transition hover:opacity-90"
            onClick={() => changeQuantity(item, 1)}
          >
            +
          </button>

          <div className="flex w-full justify-end px-2">
            <Trash
              className="cursor-pointer text-sm text-gray-400 transition hover:text-red-600"
              onClick={() => removeItem(item)}
            ></Trash>
          </div>
        </div>
      </div>
    </div>
  );
}
