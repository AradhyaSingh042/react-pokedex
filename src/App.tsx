import PokeCard from "./components/poke-card";
import Sidebar from "./components/sidebar";
import { useState } from "react";

const App = () => {
  const [selectedPokemon, setSelectedPokemon] = useState<number>(0);

  return (
    <div className="wrapper w-full h-screen bg-zinc-900 overflow-x-hidden">
      <div className="main-content h-[calc(100vh-2rem)] max-w-10/12 pt-24 w-10/12 mx-auto flex flex-row gap-7">
        <Sidebar selectedPokemon={selectedPokemon} setSelectedPokemon={setSelectedPokemon} />
        <PokeCard selectedPokemon={selectedPokemon} />
      </div>
    </div>
  );
};

export default App;
