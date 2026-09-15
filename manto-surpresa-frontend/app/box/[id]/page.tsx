import Image from "next/image"
import BoxForm from "./BoxForm"
import { getBoxById } from "@/app/services/boxService"

interface PageProps {
    params: Promise<{
        id: number
    }>
}

export default async function BoxPage({ params }: PageProps) {
    const { id } = await params
    const box = await getBoxById(id);

    return (
        <main className="w-full px-8 py-8">
            <div className="mx-auto max-w-4xl">
                <h1 className="text-3xl font-bold text-primary">
                    {box.name}
                </h1>

                <section className="grid mt-4 gap-4 md:grid-cols-[350px_1fr] md:gap-12">
                    
                    <div className="flex flex-col gap-4 items-center">
                        <Image
                            src={box.image}
                            alt={box.name}
                            width={350}
                            height={350}
                            className="rounded-md"
                        />
                    </div>

                    <div className="flex flex-col gap-6">
                        <p className="text-gray-600 justify">
                            {box.description}
                        </p>
                        
                        <BoxForm price={box.price}/>

                    </div>
                </section>
            </div>

        </main>
    )
}