import React from "react";
import { useState } from "react";
import "./App.css";

interface Card {
  name: string;
  img: string;
}

type Mode = "partner" | "friend" | "bg";

const App = () => {
  const [commander, setCommander] = useState<Card | null>();
  const [partner, setPartner] = useState<Card | null>();

  const fetchCommander = async () => {
    const baseUrl = "https://api.scryfall.com/cards/";

    const randomLegendaryParams = new URLSearchParams({
      q: "is:commander f:commander",
    }).toString();

    const fetchRandomLegendary = async () => {
      setCommander(null);
      setPartner(null);
      await fetch(`${baseUrl}random?${randomLegendaryParams}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          const name = data.name;
          const img = data.image_uris
            ? data.image_uris.normal
            : data.card_faces[0].image_uris.normal;

          setCommander({ name, img });

          if (data.keywords.includes("Partner with")) {
            const partnerName = data.oracle_text.match(
              /(?<=Partner\swith\s)(.+?)(\s\(|\n)/
            )[1];
            fetchPartnerWith(partnerName);
            return;
          }
          if (data.keywords.includes("Partner")) {
            fetchPartner(name, "partner");
            return;
          }
          if (data.oracle_text.includes("Friends forever")) {
            fetchPartner(name, "friend");
            return;
          }
          if (data.oracle_text.includes("Choose a Background")) {
            fetchPartner(name, "bg");
            return;
          }
        });
    };

    const randomPartnerParams = (name: string, mode: Mode) => {
      const condition = (mode: Mode) => {
        switch (mode) {
          case "partner":
            return "keyword:partner";
          case "friend":
            return "o:'Friends forever'";
          case "bg":
            return "type:background";
        }
      };
      return new URLSearchParams({
        q: `is:commander f:commander ${condition(
          mode
        )} -keyword:"partner with" -"${name}"`,
      }).toString();
    };

    const fetchPartner = async (name: string, mode: Mode) => {
      await fetch(`${baseUrl}random?${randomPartnerParams(name, mode)}`, {
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
      <header>
        <h1>統率者ガチャ</h1>
        <section className="description">
          <span>「何か新しいデッキを組みたいけどアイデアがない」</span>
          <span>
            <span>そんなあなたに統率者ガチャ。</span>
            <span>ランダムな統率者をあなたに提案します。</span>
          </span>
        </section>
        <button onClick={() => fetchCommander()}>お題を見る</button>
      </header>
      <section className="result-img">
        {commander && (
          <div className="result-img-child">
            <img src={commander.img} alt="" />
          </div>
        )}
        {partner && (
          <div className="result-img-child">
            <img src={partner.img} alt="" />
          </div>
        )}
      </section>
    </div>
  );
};

export default App;
