import { SearchIcon } from "lucide-react";
import usePokemon from "../hooks/use-pokemon";
import { getFullPokedexNumber } from "../utils";
import { SidebarProps } from "../types/interface";
import { useState } from "react";

const Sidebar: React.FC<SidebarProps> = ({
  selectedPokemon,
  setSelectedPokemon,
}) => {
  const { pokemonList } = usePokemon();
  const [searchInput, setSearchInput] = useState<string>("");

  const filteredPokemonList = pokemonList.filter((pokemon, pokemonIndex) => {
    if (getFullPokedexNumber(pokemonIndex).toString().includes(searchInput)) {
      return true;
    }

    if (pokemon.toLowerCase().includes(searchInput.toLowerCase())) {
      return true;
    }

    return false;
  });

  return (
    <>
      <h1 className="text-4xl text-blue-500 sm:block hidden absolute top-8 font-bold tracking-wide">
        Pokédex
      </h1>
      <aside className="flex h-96 sm:h-full w-full sm:w-1/3 lg:w-1/4 flex-col gap-4">
      <h1 className="text-4xl text-blue-500 block sm:hidden font-bold tracking-wide">
        Pokédex
      </h1>
        <div className="sidebar-header w-full relative">
          <SearchIcon className="size-4 absolute top-1/2 left-3 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="E.g. 001 or Bulba..."
            className="py-2 pl-10 pr-4 bg-zinc-800 w-full outline-none border border-zinc-700 text-slate-300 rounded-md placeholder:text-sm lg:placeholder:text-base"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <div className="sidebar-list flex flex-col gap-2 p-2 h-full bg-zinc-800 rounded-lg overflow-y-scroll">
          {filteredPokemonList.map((pokemon, pokemonIndex) => {
            const originalPokemonNumber = pokemonList.indexOf(pokemon);
            return (
              <button
                key={pokemonIndex}
                className={`flex gap-2 hover:bg-zinc-700 transition-colors duration-200 w-full py-2 px-4 rounded-md cursor-pointer text-sm lg:text-base tracking-wide ${
                  selectedPokemon === pokemonIndex && "bg-zinc-700"
                }`}
                onClick={(e) => setSelectedPokemon(originalPokemonNumber)}
              >
                <span
                  className={`${
                    selectedPokemon === pokemonIndex
                      ? "text-blue-500"
                      : "text-zinc-400"
                  }`}
                >
                  {getFullPokedexNumber(originalPokemonNumber)}
                </span>
                <span
                  className={`${
                    selectedPokemon === pokemonIndex
                      ? "text-blue-400"
                      : "text-slate-200"
                  }`}
                >
                  {pokemon}
                </span>
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
