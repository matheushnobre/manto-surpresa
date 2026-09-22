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
            className={`group relative overflow-hidden rounded-2xl p-6 shadow-lg`}
        >
            <span className="text-6xl font-black text-primary/10">
                {step}
            </span>

            <div className="relative mt-4">
                <Image
                    src={image}
                    alt={title}
                    width={300}
                    height={300}
                    className="mx-auto transition-transform duration-300 group-hover:scale-105 rounded-md"
                />

                <h3 className="mt-6 text-xl font-bold text-primary">
                    {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                    {description}
                </p>
            </div>
        </div>
    );
}