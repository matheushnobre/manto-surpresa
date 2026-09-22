"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { userCartStore } from "@/stores/userCartStore";
import CartComponent from "../cart/Cart";
import Image from "next/image";

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
              className="transition hover:text-secondary hover:scale-105"
            >
              Caixas misteriosas
            </Link>

            <Link
              href="/contact"
              className="transition hover:text-secondary hover:scale-105"
            >
              Entre em contato
            </Link>

            <Link
              href="/tracking"
              className="transition hover:text-secondary hover:scale-105"
            >
              Rastreie seu pedido
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-4 px-2">
            <button
              className="ml-auto flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-primary transition hover:opacity-90 hover:scale-105 cursor-pointer"
              onClick={() => setCartOpen(!cartOpen)}
            >
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />

                {totalItems > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-bold text-white">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </div>

              <p className="hidden md:block ml-2">Carrinho</p>
            </button>

            {/* Mobile */}
            <button
              className="md:hidden text-3xl transition hover:text-secondary hover:scale-105 cursor-pointer"
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
              <Link href="/" className="transition hover:text-secondary">
                Início
              </Link>

              <Link href="/boxes" className="transition hover:text-secondary">
                Caixas misteriosas
              </Link>

              <Link href="/contact" className="transition hover:text-secondary">
                Entre em contato
              </Link>

              <Link
                href="/tracking"
                className="transition hover:text-secondary"
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
