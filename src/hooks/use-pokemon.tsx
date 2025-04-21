import { useState, useEffect } from "react";
import axios from "axios";

const usePokemon = () => {
  const [pokemonList, setPokemonList] = useState<string[]>([]);

  useEffect(() => {
    async function initializePokemonList() {
      try {
        const url = "https://pokeapi.co/api/v2/pokemon/?limit=150&offset=0";
        const response = await axios({
          method: "GET",
          url,
          responseType: "json",
        });

        const pokemonListData: { name: string; url: string }[] =
          response.data.results;
        const finalList = pokemonListData.map((pokemon) => pokemon.name);
        setPokemonList(finalList);
      } catch (err) {
        alert("Error while fetching the pokemon list");
      }
    }

    initializePokemonList();
  }, []);

  return { pokemonList };
};

export default usePokemon;
