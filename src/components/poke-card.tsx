import { useEffect, useState } from "react";
import { MoveDetails, PokeCardProps, PokemonData } from "../types/interface";
import axios from "axios";
import { getFullPokedexNumber, getPokedexNumber } from "../utils";
import TypeCard from "./type-card";
import Modal from "./modal";

const PokeCard: React.FC<PokeCardProps> = ({ selectedPokemon }) => {
  const [pokemonData, setPokemonData] = useState<PokemonData>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [moveDetails, setMoveDetails] = useState<MoveDetails>();
  const [loadingMoveDetails, setLoadingMoveDetails] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { name: pokemonName, stats, types, moves, sprites } = pokemonData || {};

  const imageUrl = sprites?.other["official-artwork"].front_default;
  const spriteSheet = [
    sprites?.front_default,
    sprites?.back_default,
    sprites?.front_shiny,
    sprites?.back_shiny,
  ];

  async function fetchMoveDetails(move: string, moveUrl: string) {
    if (loadingMoveDetails || !moveUrl) return;

    // check cache for move details
    let cache: Record<string, any> = {};
    if (localStorage && localStorage.getItem("pokemon-moves")) {
      cache = JSON.parse(localStorage.getItem("pokemon-moves") as string);
    }

    if (move in cache) {
      setMoveDetails(cache[move]);
      return;
    }

    try {
      setLoadingMoveDetails(true);
      const response = await axios({
        method: "GET",
        url: moveUrl,
        responseType: "json",
      });
      const description = response.data.flavor_text_entries.find(
        (entry: any) =>
          entry.language.name === "en" &&
          entry.version_group.name === "platinum"
      );
      cache[move] = {
        moveName: move,
        description: description.flavor_text,
      };
      localStorage.setItem("pokemon-moves", JSON.stringify(cache));
      setMoveDetails(cache[move]);
    } catch (e) {
      alert("Error while fetching the move details");
    } finally {
      setLoadingMoveDetails(false);
    }
  }

  useEffect(() => {
    // if loading or no localStorage, exit the useEffect logic
    if (isLoading) return;

    // check if the selectedPokemon Data is available in the cache
    // 1. define the cache
    // 2. check if the data is available in the cache, otherwise fetch the data from the API
    let cache: Record<number, any> = {};
    if (localStorage && localStorage.getItem("pokedex")) {
      cache = JSON.parse(localStorage.getItem("pokedex") as string);
    }

    if (selectedPokemon in cache) {
      setPokemonData(cache[selectedPokemon]);
      return;
    }

    // if we fetch from the API, make sure to save the data in the cache for future use
    async function fetchPokemonData() {
      try {
        setIsLoading(true);
        const url = `https://pokeapi.co/api/v2/pokemon/${getPokedexNumber(
          selectedPokemon
        )}`;
        const response = await axios({
          method: "GET",
          url,
          responseType: "json",
        });
        setPokemonData(response.data);
        cache[selectedPokemon] = response.data;
        localStorage.setItem("pokedex", JSON.stringify(cache));
      } catch (err) {
        alert("Error while fetching the pokemon data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPokemonData();
  }, [selectedPokemon]);

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center">
        <div role="status">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="poke-card sm:w-full sm:overflow-y-auto p-6 bg-zinc-800 rounded-lg">
      {isModalOpen && (
        <Modal handleModalClose={() => setIsModalOpen(false)}>
          {loadingMoveDetails ? (
            <div className="w-full h-full text-xl flex justify-center items-center">
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <span className="text-zinc-300 font-semibold tracking-wide">
                Name
              </span>
              <h3 className="text-teal-400 mt-1 capitalize text-3xl font-bold tracking-wide">
                {moveDetails?.moveName.replace("-", " ")}
              </h3>
              <hr className="mt-6 text-teal-100 mb-2" />
              <span className="text-zinc-300 font-semibold tracking-wide">
                Description
              </span>
              <p className="text-teal-400 mt-1 font-medium tracking-wide">
                {moveDetails?.description}
              </p>
            </>
          )}
        </Modal>
      )}

      <span className="text-sm text-zinc-400 font-medium tracking-wide">
        #{getFullPokedexNumber(selectedPokemon)}
      </span>
      <div className="top-container mt-1 flex justify-between items-center">
        <h2 className="text-3xl capitalize text-slate-100 font-semibold">
          {pokemonName}
        </h2>
        <div className="type-container flex flex-row gap-3 items-center">
          {types?.map((pokemonType, pokemonTypeIndex) => {
            return (
              <TypeCard key={pokemonTypeIndex} type={pokemonType.type.name} />
            );
          })}
        </div>
      </div>
      <div className="main-container mt-5 w-full flex flex-col xl:flex-row justify-between gap-12">
        <div className="image-container flex flex-col gap-4 cursor-pointer bg-zinc-700 rounded-lg p-4 w-full xl:w-[400px]">
          <img
            src={imageUrl as string}
            alt={pokemonName as string}
            className="w-full"
          />

          <div className="sprites-container w-full flex justify-center gap-4">
            {spriteSheet.map((sprite, spriteIndex) => {
              return (
                <div
                  key={spriteIndex}
                  className="sprite-item cursor-pointer w-16 bg-zinc-600 rounded-md"
                >
                  <img
                    src={sprite as string}
                    alt={`${pokemonName}-${spriteIndex}` as string}
                    className="w-full"
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="stats-container w-full flex flex-col gap-4 xl:w-[calc(100%-400px)]">
          <h3 className="text-slate-100 text-2xl font-semibold tracking-wide">
            Stats
          </h3>
          <div className="stats-grid grid grid-cols-2 md:grid-cols-3 xl:grid-cols-2 gap-4">
            {stats?.map((statData, statIndex) => {
              return (
                <div
                  key={statIndex}
                  className="stat-item cursor-pointer flex flex-col justify-between gap-2 w-full bg-zinc-700 rounded-md p-4"
                >
                  <span className="text-zinc-400 capitalize font-semibold">
                    {statData.stat.name.replace("-", " ")}
                  </span>
                  <span className="text-slate-100 text-3xl tracking-wide font-bold">
                    {statData.base_stat}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <h3 className="text-slate-100 mt-12 text-2xl font-semibold tracking-wide">
        Moves
      </h3>

      <div className="moves-container mt-4 w-full grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {moves?.map((moveData, moveIndex) => {
          return (
            <button
              key={moveIndex}
              className="move-card cursor-pointer bg-zinc-700 hover:bg-zinc-600 active:bg-zinc-600 shadow-none hover:shadow-md hover:shadow-blue-300 transition-all duration-200 text-slate-100 p-4 capitalize rounded-md"
              onClick={(e) => {
                setIsModalOpen(true);
                fetchMoveDetails(moveData.move.name, moveData.move.url);
              }}
            >
              {moveData.move.name.replace("-", " ")}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PokeCard;
