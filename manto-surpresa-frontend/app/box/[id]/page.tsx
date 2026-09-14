import Image from "next/image"
import BoxForm from "./BoxForm"

interface PageProps {
    params: Promise<{
        id: string
    }>
}

export default async function BoxPage({ params }: PageProps) {
    const { id } = await params

    {/* Depois será apagado */}
    const image = "/boxes/box_selecao.png"
    const name ="Box Seleção"
    const description = "A Box Seleção é ideal para quem deseja adquirir uma camisa de uma seleção nova. Oportunidade perfeita para ter não somente uma nova camisa, mas conhecer, quem sabe, uma nova cultura ou país."
    const price = 179.90

    return (
        <main className="w-full px-8 py-8">
            <div className="mx-auto max-w-4xl">
                <h1 className="text-3xl font-bold text-primary">
                    {name}
                </h1>

                <section className="grid mt-4 gap-4 md:grid-cols-[350px_1fr] md:gap-12">
                    
                    <div className="flex flex-col gap-4 items-center">
                        <Image
                            src={image}
                            alt={name}
                            width={350}
                            height={350}
                            className="rounded-md"
                        />
                    </div>

                    <div className="flex flex-col gap-6">
                        <p className="text-gray-600 justify">
                            {description}
                        </p>
                        
                        <BoxForm price={price}/>

                    </div>
                </section>
            </div>

        </main>
    )
}