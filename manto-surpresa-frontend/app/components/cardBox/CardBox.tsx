import Image from "next/image"
import Link from "next/link"

interface CardBoxProps {
    image: string
    name: string
    description: string
    price: number
}

export default function CardBox({
    image, 
    name,
    description,
    price
}: CardBoxProps) {
    return (
        <article className="w-70 max-w-sm shrink-0 px-4 py-4 rounded-lg shadow-lg pb-6 transition hover:scale-102">
            <Link href="/box">
            
            <Image
                src={image}
                alt={name}
                width={350}
                height={350}
                className="w-full h-auto rounded-md"
            />
            <h3 className="text-primary text-2xl font-bold mt-4">
                {name}
            </h3>

            <p className="text-justify mt-2 h-30 text-sm">
                {description}
            </p>

            <div className="flex flex-col items-end gap-1">
                <p className="items-end text-text-secondary text-sm">
                    R$ 
                    <span className="ml-1 text-primary text-bold text-lg">
                        {price.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </span>
                </p>
                <button className="bg-primary rounded-md text-white text-sm p-3 transition hover:scale-105">
                    Comprar agora
                </button>
            </div>
            </Link>
        </article>
    )
}