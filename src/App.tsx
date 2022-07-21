import React from "react";
import { useState } from "react";
import "./App.css";

interface Card {
  name: string;
  img: string;
}

const App = () => {
  const [commander, setCommander] = useState<Card | null>();
  const [partner, setPartner] = useState<Card | null>();

  const fetchCommander = async () => {
    const baseUrl = "https://api.scryfall.com/cards/";

    const randomLegendaryParams = new URLSearchParams({
      q: "is:commander f:commander",
    }).toString();

    const fetchRandomLegendary = async () => {
      await fetch(`${baseUrl}random?${randomLegendaryParams}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          const name = data.name;
          const img = data.image_uris.normal;
          if (data.keywords.includes("Partner with")) {
            const partnerName = data.oracle_text.match(
              /(?<=Partner\swith\s)(.+?)(\s\(|\n)/
            )[1];
            fetchPartnerWith(partnerName);
          } else if (data.keywords.includes("Partner")) {
            fetchPartner(name);
          } else setPartner(null);
          if (data.oracle_text.includes("Friends forever")) {
            fetchPartner(name, true);
          }
          setCommander({ name, img });
        });
    };

    const randomPartnerParams = (name: string, isFriend: boolean = false) =>
      new URLSearchParams({
        q: `is:commander f:commander ${
          isFriend ? "o:'Friends forever'" : "keyword:partner "
        }-keyword:'partner with' -'${name}'`,
      }).toString();

    const fetchPartner = async (name: string, isFriend: boolean = false) => {
      await fetch(`${baseUrl}random?${randomPartnerParams(name, isFriend)}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          const name = data.name;
          const img = data.image_uris.normal;
          setPartner({ name, img });
        });
    };

    const fetchPartnerWith = async (name: string) => {
      const partnerParams = new URLSearchParams({
        exact: name,
      }).toString();
      await fetch(`${baseUrl}named?${partnerParams}`, { method: "GET" })
        .then((res) => res.json())
        .then((data) => {
          const name = data.name;
          const img = data.image_uris.normal;
          setPartner({ name, img });
        });
    };

    await fetchRandomLegendary();
  };
  return (
    <div className="App">
      <button onClick={() => fetchCommander()}>お題を見る</button>
      <div style={{ display: "flex" }}>
        {commander && (
          <div>
            <div>{commander.name}</div>
            <img src={commander.img} alt="" />
          </div>
        )}
        {partner && (
          <div>
            <div>{partner.name}</div>
            <img src={partner.img} alt="" />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
