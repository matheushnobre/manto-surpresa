import Image from "next/image";
import { Trash } from "lucide-react";
import { userCartStore } from "@/stores/userCartStore";
import { CartItem } from "@/types/cartItem";
import { Button } from "@/components//ui/button";

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
          <Button
            className="h-7 w-7 bg-[#F8F8F8] border-2 shadow-[2px_2px_0px_#0E2357] cursor-pointer items-center justify-center"
            onClick={() => changeQuantity(item, -1)}
          >
            −
          </Button>

          <p className="w-4 text-center text-md font-medium">{item.quantity}</p>

          <Button
            className="h-7 w-7 border-2 shadow-[2px_2px_0px_#0E2357] cursor-pointer items-center justify-center"
            onClick={() => changeQuantity(item, 1)}
          >
            +
          </Button>

          <div className="flex w-full justify-end px-2">
            <Button
              className="p-3 bg-[#9C2007] border-3 border-black shadow-[3px_3px_0px_#180501] hover:shadow-[2px_2px_0px_#180501]"
              onClick={() => removeItem(item)}
            >
              <Trash className="text-gray-200"/>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
