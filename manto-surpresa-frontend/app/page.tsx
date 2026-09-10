import CardBox from "./components/cardBox/CardBox";

export default function PageHome() {  return (
    <main>
        <div className="flex flex-wrap items-center justify-center gap-8 p-8">
          <CardBox
              image="/boxes/box_classica.png"
              name="Box Clássica"
              description="Na Box Clássica, você pode receber a camisa de um clube ou seleção, seja retrô ou atual. É a surpresa perfeita para os amantes do futebol, sendo a box principal da Manto Surpresa!"
              price={179.90}
          />
          <CardBox
              image="/boxes/box_retro.png"
              name="Box Retrô"
              description="Na Box Retrô, a surpresa continua, mas há uma certeza: a camisa recebida será uma retrô, agradando fãs nostálgicos e que desejam relembrar times históricos do passado."
              price={199.90}
          />
          <CardBox
              image="/boxes/box_selecao.png"
              name="Box Seleção"
              description="A Box Seleção é ideal para quem deseja adquirir uma camisa de uma seleção nova. Oportunidade perfeita para ter não somente uma nova camisa, mas conhecer, quem sabe, uma nova cultura ou país."
              price={179.90}
          />
        </div>
        
    </main>
  );
}
