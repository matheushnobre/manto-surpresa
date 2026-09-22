import CardBox from "../components/cardBox/CardBox";
import { getBoxes } from "../services/boxService";
import { Box } from "../types/box";
import CardSteps from "../components/cardSteps/CardSteps";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PageHome() {
  const boxes = await getBoxes();

  return (
    <main>
      <section className="flex flex-wrap min-h-[calc(100vh-4rem)] items-center justify-center gap-8 justify-center px-8 pt-8 pb-16">
        {boxes.map((box: Box) => (
          <CardBox
            key={box.id}
            id={box.id}
            image={`/assets${box.image}`}
            name={box.name}
            description={box.description}
            price={box.price}
          />
        ))}
      </section>

      <section className="px-10 pt-10 pb-16  min-h-[100vh] flex items-center justify-center bg-white md-px-6">
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
              image="/assets/steps/step01.png"
              title="Escolha sua Box"
              description="Escolha a box que mais combina com você e prepare-se para uma experiência diferente."
              background_color="var(--color-secondary)"
            />

            <CardSteps
              step="02"
              image="/assets/steps/step02.png"
              title="Finalize seu Pedido"
              description="Informe seu tamanho, finalize o pagamento e deixe a expectativa tomar conta."
              background_color="white"
            />

            <CardSteps
              step="03"
              image="/assets/steps/step03.png"
              title="Seja Surpreendido"
              description="Agora é só esperar sua box chegar e descobrir qual manto está esperando por você."
              background_color="var(--color-secondary)"
            />
          </div>

          <div className="mt-8 w-full flex items-center justify-center">
            <Link
              className="bg-[#5CFF5C] font-bold text-md text-primary p-4 px-8 rounded-full animate-[pulse-scale_2s_ease-in-out_infinite] hover:scale-105 cursor-pointer"
              href="boxes"
            >
              Quero ser Surpreendido!
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
