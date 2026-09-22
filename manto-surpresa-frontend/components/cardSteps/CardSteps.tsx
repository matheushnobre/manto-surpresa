import Image from "next/image";

interface CardStepsProps {
    step: string;
    image: string;
    title: string;
    description: string;
    background_color: string;
}

export default function CardSteps({
    step,
    image,
    title,
    description,
    background_color
}: CardStepsProps){
    return (
        <div 
            style={{backgroundColor: background_color}}
            className="group relative overflow-hidden p-6 border-4 border-primary shadow-[7px_7px_0px_#0E2357] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_#0E2357] rounded-lg"
        >
            <span className="text-4xl font-black text-primary">
                {step}
            </span>

            <div className="relative mt-4">
                <Image
                    src={image}
                    alt={title}
                    width={300}
                    height={300}
                    className="mx-auto transition-transform duration-300 group-hover:scale-105 rounded-lg border-3"
                />

                <h3 className="mt-6 text-xl font-bold text-primary">
                    {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600 text-justify">
                    {description}
                </p>
            </div>
        </div>
    );
}