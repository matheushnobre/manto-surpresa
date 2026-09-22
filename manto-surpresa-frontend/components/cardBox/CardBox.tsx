import Image from "next/image"
import Link from "next/link"

interface CardBoxProps {
    id: number
    image: string
    name: string
    description: string
    price: number
}

export default function CardBox({
    id,
    image, 
    name,
    description,
    price
}: CardBoxProps) {
    return (
        <article className="w-[80%] max-w-xs shrink-0 px-8 md:px-4 py-4 rounded-lg shadow-lg pb-6 transition hover:scale-102">
            <Link href={`/box/${id}`}>

            <div className="w-full flex items-center justify-center mt-2">
                <Image
                    src={image}
                    alt={name}
                    width={300}
                    height={300}
                    className="w-[80%] h-auto rounded-md"
                />
            </div>
            
            <h3 className="text-primary text-lg md:text-lg font-bold mt-4">
                {name}
            </h3>

            <p className="text-justify mt-2 text-sm md:text-md">
                {description}
            </p>

            <div className="flex flex-col items-end gap-1 mt-4">
                <p className="items-end text-text-secondary text-sm">
                    R$ 
                    <span className="ml-1 text-primary text-bold text-lg">
                        {price.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </span>
                </p>
                <button className="bg-[#5CFF5C] rounded-full border-1 text-primary text-sm py-2 px-4 transition hover:scale-105 cursor-pointer">
                    Comprar agora
                </button>
            </div>
            </Link>
        </article>
    )
}