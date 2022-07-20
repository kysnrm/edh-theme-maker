import React from "react";
import { useState } from "react";
import "./App.css";

interface Card {
  name: string;
  img: string;
}

const App = () => {
  const [commander, setCommander] = useState<Card | null>();

  const fetchCommander = async () => {
    const baseUrl = "https://api.scryfall.com/cards/random";

    const randomLegendaryParams = new URLSearchParams({
      q: "t:legend",
    }).toString();
    const randomLegendaryUrl = `${baseUrl}?${randomLegendaryParams}`;

    const fetchRandomLegendary = async () => {
      await fetch(randomLegendaryUrl, { method: "GET" })
        .then((res) => res.json())
        .then((data) => {
          console.log(data.type_line);
          if (!data.type_line.includes("Creature")) {
            fetchRandomLegendary();
            return;
          }
          const name = data.name;
          const img = data.image_uris.normal;
          setCommander({ name, img });
        });
    };

    await fetchRandomLegendary();
  };
  return (
    <div className="App">
      <button onClick={() => fetchCommander()}>お題を見る</button>
      {commander && (
        <div>
          <div>{commander.name}</div>
          <img src={commander.img} alt="" />
        </div>
      )}
    </div>
  );
};

export default App;
