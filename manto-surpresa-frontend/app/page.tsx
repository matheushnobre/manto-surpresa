import CardBox from "./components/cardBox/CardBox";
import Image from "next/image";

export default function PageHome() {  return (
    <main>
        <section className="min-h-[calc(100vh-4rem)] flex flex-wrap gap-8 justify-center px-8 py-8">
          <CardBox
              id={1}
              image="/boxes/box_classica.png"
              name="Box Clássica"
              description="Na Box Clássica, você pode receber a camisa de um clube ou seleção, seja retrô ou atual. É a surpresa perfeita para os amantes do futebol, sendo a box principal da Manto Surpresa!"
              price={179.90}
          />
          <CardBox
              id={2}
              image="/boxes/box_retro.png"
              name="Box Retrô"
              description="Na Box Retrô, a surpresa continua, mas há uma certeza: a camisa recebida será uma retrô, agradando fãs nostálgicos e que desejam relembrar times históricos do passado."
              price={199.90}
          />
          <CardBox
              id={3}
              image="/boxes/box_selecao.png"
              name="Box Seleção"
              description="A Box Seleção é ideal para quem deseja adquirir uma camisa de uma seleção nova. Oportunidade perfeita para ter não somente uma nova camisa, mas conhecer, quem sabe, uma nova cultura ou país."
              price={179.90}
          />
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
