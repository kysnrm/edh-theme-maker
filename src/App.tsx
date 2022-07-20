import React from "react";
import "./App.css";

const App = () => {
  const fetchLegendary = async () => {
    const baseUrl = "https://api.scryfall.com/cards/random";

    const randomLegendaryParams = new URLSearchParams({
      q: "t:legend",
    }).toString();
    const randomLegendaryUrl = `${baseUrl}?${randomLegendaryParams}`;

    await fetch(randomLegendaryUrl, { method: "GET" })
      .then((res) => res.json())
      .then((data) => console.log(data));
  };
  return (
    <div className="App">
      <button onClick={() => fetchLegendary()}>お題を見る</button>
    </div>
  );
};

export default App;
