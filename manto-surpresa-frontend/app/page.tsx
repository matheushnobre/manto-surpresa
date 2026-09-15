import CardBox from "./components/cardBox/CardBox";
import Image from "next/image";
import { getBoxes } from "./services/boxService";
import { Box } from "./types/box";

export default async function PageHome() {  
    const boxes = await getBoxes()

    return (
        <main>
            <section className="min-h-[calc(100vh-4rem)] flex flex-wrap gap-8 justify-center px-8 py-8">
            {boxes.map((box: Box) => (
                <CardBox key={box.id}
                    id = {box.id}
                    image = {box.image}
                    name = {box.name}
                    description = {box.description}
                    price = {box.price}
                />
            ))}
            </section>

            <section className="flex flex-col bg-secondary w-full py-8 px-4">
                <div className="flex justify-center">
                    <h2 className="text-primary font-bold text-2xl">
                        Manto Surpresa
                    </h2>
                </div>

                <div className="flex items-center justify-center p-4 gap-8">
                    <Image 
                        src="/1.png"
                        alt="Manto Surpresa Entregue"
                        width={400}
                        height={400}
                    />
                </div>
            </section>
        </main>
    );
}
