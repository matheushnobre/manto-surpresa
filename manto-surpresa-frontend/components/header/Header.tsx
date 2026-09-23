"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { userCartStore } from "@/stores/userCartStore";
import CartComponent from "../cart/Cart";
import Image from "next/image";
import { Button } from "@/components/ui/button"

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const items = userCartStore((state) => state.items);

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <header className="bg-primary text-white">
        <div className="mx-auto flex h-16 items-center gap-8 px-4">
          <Link
            href="/"
            className="font-bold text-xl transition hover:scale-105"
            aria-label="Manto Surpresa - página inicial"
          >
            <Image src="/favicon.ico" alt="" width={50} height={50} />
          </Link>

          {/* Desktop */}
          <nav className="hidden md:flex gap-8">
            <Link
              href="/boxes"
              className="text-white px-2 py-1 text-primary transition-all hover:-translate-y-[-2px] active:translate-x-[-2px] active:translate-y-[2px] active:shadow-none hover:text-secondary"
            >
              Caixas misteriosas
            </Link>

            <Link
              href="/contact"
              className="text-white px-2 py-1 text-primary transition-all hover:-translate-y-[-2px] active:translate-x-[-2px] active:translate-y-[2px] active:shadow-none hover:text-secondary"
            >
              Entre em contato
            </Link>

            <Link
              href="/tracking"
              className="text-white px-2 py-1 text-primary transition-all hover:-translate-y-[-2px] active:translate-x-[-2px] active:translate-y-[2px] active:shadow-none hover:text-secondary"
            >
              Rastreie seu pedido
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-4 px-2">
            <Button
              className="flex items-center gap-1 px-4 h-[80%] cursor-pointer text-md"
              onClick={() => setCartOpen(!cartOpen)}
            >
              <div className="relative">
                <ShoppingCart className="size-4" />

                {totalItems > 0 && (
                  <span className="absolute -right-3 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-xs text-white">
                    {totalItems >= 10 ? "10+" : totalItems}
                  </span>
                )}
              </div>

              <p className="hidden md:block ml-2">Carrinho</p>
            </Button>

            {/* Mobile */}
            <button
              className="md:hidden text-2xl transition cursor-pointer hover:translate-x-[2px] hover:translate-y-[2px]"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuOpen}
            >
              ☰
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {menuOpen && (
          <nav className="md:hidden p-4">
            <div className="flex flex-col gap-4">
              <Link href="/" className="text-white px-2 text-primary transition-all hover:-translate-y-[-2px] active:translate-x-[-2px] active:translate-y-[2px] active:shadow-none hover:text-secondary">
                Início
              </Link>

              <Link href="/boxes" className="text-white px-2 text-primary transition-all hover:-translate-y-[-2px] active:translate-x-[-2px] active:translate-y-[2px] active:shadow-none hover:text-secondary">
                Caixas misteriosas
              </Link>

              <Link href="/contact" className="text-white px-2 text-primary transition-all hover:-translate-y-[-2px] active:translate-x-[-2px] active:translate-y-[2px] active:shadow-none hover:text-secondary">
                Entre em contato
              </Link>

              <Link
                href="/tracking"
                className="text-white px-2 text-primary transition-all hover:-translate-y-[-2px] active:translate-x-[-2px] active:translate-y-[2px] active:shadow-none hover:text-secondary"
              >
                Rastreie seu pedido
              </Link>
            </div>
          </nav>
        )}
      </header>

      <CartComponent open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
