import { TypeCardProps } from "../types/interface";
import { pokemonTypeColors } from "../utils";

const TypeCard: React.FC<TypeCardProps> = ({ type }) => {
  return (
    <div
      className={`pokemon-type py-1.5 px-3 text-xs text-shadow-md ${pokemonTypeColors[type as keyof typeof pokemonTypeColors]} text-zinc-800 cursor-pointer rounded-3xl tracking-wide font-bold`}
    >
      {type}
    </div>
  );
};

export default TypeCard;
