import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

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
        <article className="w-[80%] max-w-xs px-8 md:px-4 py-4 pb-6 border-4 border-primary shadow-[7px_7px_0px_#0E2357] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_#0E2357] rounded-lg">
            <Link href={`/box/${id}`}>

            <div className="w-full flex items-center justify-center mt-2">
                <Image
                    src={image}
                    alt={name}
                    width={300}
                    height={300}
                    className="w-[80%] h-auto rounded-lg aspect-square"
                />
            </div>
            
            <h3 className="text-primary text-lg md:text-lg font-bold mt-4">
                {name}
            </h3>

            <p className="text-justify mt-2 text-sm md:text-md">
                {description}
            </p>

            <div className="flex flex-col items-end gap-1 mt-2">
                <p className="items-end text-text-secondary text-sm">
                    R$ 
                    <span className="ml-1 text-primary text-bold text-lg">
                        {price.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </span>
                </p>
                <Button className="bg-[#5CFF5C] px-5 py-4 shadow-[5px_5px_0px_#0E2357]">
                    Comprar agora
                </Button>
            </div>
            </Link>
        </article>
    )
}