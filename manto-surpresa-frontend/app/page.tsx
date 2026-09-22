import CardBox from "../components/cardBox/CardBox";
import { getBoxes } from "../services/boxService";
import { Box } from "../types/box";
import CardSteps from "../components/cardSteps/CardSteps";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function PageHome() {
  const boxes = await getBoxes();

  return (
    <main className="min-w-0">
      
      <div className="flex w-full md:min-h-[calc(100vh-4rem)]">
        <div className="relative hidden lg:block lg:w-[70%] ">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/assets/cartoon_welcome.mp4" type="video/mp4"></source>
          </video>

          <div className="absolute top-10 w-full px-4">
            <div className="relative ml-auto mr-8 w-fit max-w-full rounded-2xl border-4 border-primary bg-secondary px-8 py-4 text-center">
              <h3 className="text-md lg:text-lg font-bold tracking-wide text-primary">
                Viva a emoção, vista a surpresa!
              </h3>
            </div>
          </div>
                    
        </div>

        <div className="w-full lg:w-[30%] flex items-center justify-center mt-1">
          <Carousel className="relative w-full">
            <CarouselContent className="pb-10">
              {boxes.map((box: Box) => (
                <CarouselItem key={box.id} className="flex items-center justify-center mt-4">
                  <CardBox
                    id={box.id}
                    image={`/assets${box.image}`}
                    name={box.name}
                    description={box.description}
                    price={box.price}
                  />
                </CarouselItem>
              ))}
              </CarouselContent>
            <div className="flex justify-center gap-4 mb-4">
              <CarouselPrevious className="static translate-y-0 size-8 rounded-lg border-4 border-primary bg-secondary text-primary shadow-[4px_4px_0px_#0E2357] transition-all hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none" />              
              <CarouselNext className="static translate-y-0 size-8 rounded-lg border-4 border-primary bg-secondary text-primary shadow-[4px_4px_0px_#0E2357] transition-all hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none" />              
            </div>
          </Carousel>

        </div>
      </div>
    
      <section className="px-10 pt-10 pb-16 md:min-h-[100vh] flex items-center justify-center bg-white md-px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-text">
              Como funciona?
            </p>

            <h2 className="text-3xl font-bold text-primary md:text-4xl text-primary">
              Sua surpresa começa aqui.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-gray-500">
              Escolha sua box, informe seu tamanho e deixe o resto com a gente.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <CardSteps
              step="01"
              image="/assets/steps/step_01.png"
              title="Escolha sua Box"
              description="Escolha a box que mais combina com você e prepare-se para uma experiência diferente."
              background_color="var(--color-secondary)"
            />

            <CardSteps
              step="02"
              image="/assets/steps/step_02.png"
              title="Finalize seu Pedido"
              description="Informe seu tamanho, finalize o pagamento e deixe a expectativa tomar conta."
              background_color="white"
            />

            <CardSteps
              step="03"
              image="/assets/steps/step_03.png"
              title="Seja Surpreendido"
              description="Agora é só esperar sua box chegar e descobrir qual manto está esperando por você."
              background_color="var(--color-secondary)"
            />
          </div>

          <div className="mt-8 w-full flex items-center justify-center">
            <Button
              className="bg-[#5CFF5C] px-8 py-6 text-md"
            >
              Quero ser Surpreendido!
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
