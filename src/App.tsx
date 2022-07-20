import React from "react";
import { useState } from "react";
import "./App.css";

interface Card {
  name: string;
  img: string;
}

const App = () => {
  const [commander, setCommander] = useState<Card | null>();

  const fetchLegendary = async () => {
    const baseUrl = "https://api.scryfall.com/cards/random";

    const randomLegendaryParams = new URLSearchParams({
      q: "t:legend",
    }).toString();
    const randomLegendaryUrl = `${baseUrl}?${randomLegendaryParams}`;

    await fetch(randomLegendaryUrl, { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        const name = data.name;
        const img = data.image_uris.normal;
        setCommander({ name, img });
      });
  };
  return (
    <div className="App">
      <button onClick={() => fetchLegendary()}>お題を見る</button>
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
