export const pokemonTypeColors = {
  normal: "bg-zinc-400",
  fire: "bg-orange-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400",
  grass: "bg-green-500",
  ice: "bg-cyan-300",
  fighting: "bg-red-600",
  poison: "bg-purple-500",
  ground: "bg-amber-600",
  flying: "bg-indigo-300",
  psychic: "bg-pink-500",
  bug: "bg-lime-500",
  rock: "bg-yellow-600",
  ghost: "bg-purple-700",
  dragon: "bg-indigo-600",
  dark: "bg-zinc-700",
  steel: "bg-slate-400",
  fairy: "bg-pink-300",
};

export function getPokedexNumber(index: number) {
  return index + 1;
}

export function getFullPokedexNumber(index: number) {
  return `${
    index + 1 > 99
      ? index + 1
      : index + 1 > 9
      ? `0${index + 1}`
      : `00${index + 1}`
  }`;
}
