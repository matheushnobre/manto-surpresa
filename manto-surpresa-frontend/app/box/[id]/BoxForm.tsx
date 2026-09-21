"use client";

import { useState } from "react";
import { userCartStore } from "@/stores/userCartStore";

interface BoxFormProps {
  id: number;
  name: string;
  price: number;
  image: string;
}

export default function BoxForm({ id, name, price, image }: BoxFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("");

  const addItem = userCartStore((state) => state.addItem);

  function handleAddToCart() {
    if (size == "" || quantity <= 0) return;
    addItem({
      id,
      name,
      price,
      image,
      quantity,
      size,
    });
  }

  return (
    <form className="flex flex-col gap-4">
      <div>
        <label htmlFor="quantity" className="mb-2 block font-medium">
          Quantidade
        </label>

        <input
          id="quantity"
          name="quantity"
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-24 rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </div>

      <div>
        <label htmlFor="size" className="mb-2 block font-medium">
          Tamanho da camisa
        </label>

        <select
          id="size"
          name="size"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="w-60 rounded-md border border-gray-300 px-3 py-2"
          required
        >
          <option value="" disabled>
            Selecione o tamanho
          </option>
          <option value="PP">PP</option>
          <option value="P">P</option>
          <option value="M">M</option>
          <option value="G">G</option>
          <option value="GG">GG</option>
          <option value="3G">3G</option>
        </select>
      </div>

      <p className="mt-2 text-2xl font-bold">
        R$ {(price * quantity).toFixed(2)}
      </p>

      <button
        type="submit"
        className="cursor-pointer rounded-md bg-primary px-6 py-3 text-white transition hover:scale-105"
        onClick={handleAddToCart}
      >
        Adicionar ao Carrinho
      </button>
    </form>
  );
}
