'use client'

import Link from "next/link"
import { useState } from "react"
import { ShoppingCart } from "lucide-react";
import Image from "next/image";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="bg-primary text-white">
            <div className="mx-auto flex h-16 items-center gap-8 px-4">
                <Link href="/" className="font-bold text-xl transition hover:scale-105">
                    <Image
                        src="/favicon.ico"
                        alt="Manto Surpresa"
                        width={50}
                        height={50}
                    ></Image>
                </Link>

                {/* Desktop */}
                <nav className="hidden md:flex gap-8">
                    <Link href="/boxes" className="transition hover:text-secondary hover:scale-105">
                        Caixas misteriosas
                    </Link>

                    <Link href="/contact" className="transition hover:text-secondary hover:scale-105">
                        Entre em contato
                    </Link>

                    <Link href="/tracking" className="transition hover:text-secondary hover:scale-105">
                        Rastreie seu pedido
                    </Link>
                </nav>

                <div className="ml-auto flex items-center gap-4 px-2">
                    <Link 
                        className="ml-auto flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-primary transition hover:opacity-90 hover:scale-105"
                        href="cart"
                    >
                        <ShoppingCart className="h-5 w-5" />
                        Carrinho
                    </Link>

                    {/* Mobile */}
                    <button
                        className="md:hidden text-2xl transition hover:text-secondary hover:scale-105"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Abrir Menu"
                    >
                        ☰
                    </button>
                </div>
            </div>

            {/* Menu Mobile */}
            {menuOpen && (
                <nav className="md:hidden p-4">
                    <div className="flex flex-col gap-4">
                        <Link href="/" className="transtition hover:text-secondary">
                            Início
                        </Link>

                        <Link href="/boxes" className="transition hover:text-secondary">
                            Caixas misteriosas
                        </Link>

                        <Link href="/contact" className="transition hover:text-secondary">
                            Entre em contato
                        </Link>

                        <Link href="/tracking" className="transition hover:text-secondary">
                            Rastreie seu pedido
                        </Link>
                    </div>
                </nav>
            )}
        </header>
    )
}