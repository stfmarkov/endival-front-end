import React, { useContext, useState, useEffect } from "react";
import { RacesContext } from "../../Context/racesContext";
import { UserContext } from "../../Context/userContext";
import { CurrentCharacterContext } from "../../Context/currentCharacterContext";
import { useHistory } from "react-router-dom";

import Button from "../button/Button.jsx";
import Character from "../character/Character.jsx";
import Select from "../select/Select.jsx";
import InfoBlock from "../infoBlock/InfoBlock.jsx";

import "./race.scss";

const ChoseRace = () => {
  // the selected race
  const [selected, setSelected] = useState("");

  // List of all races
  const [racesList, setRacesList] = useState([]);

  const [xp, setXp] = useState(10);

  // Race feats
  const [feats, setFeats] = useState([]);
  const [feat, setFeat] = useState({});

  // the additional player selected points
  const [added, setAdded] = useState({
    str: 0,
    con: 0,
    dex: 0,
    spd: 0,
    will: 0,
    magic: 0,
    divineKnowledge: 0,
    magicalKnowledge: 0,
    fightingKnowledge: 0,
    practicalKnowledge: 0,
    teoreticalKnowledge: 0,
  });

  // Names of the stats. Use bulgarian by default
  const [statNames, setStatNames] = useState({
    strData: "Сила",
    dexData: "Ловкост",
    conData: "Издражливост",
    willData: "Воля",
    magicData: "Ефирност",
    spdData: "Бързина",
  });

  const characterSetup = {
    isCreating: true,
    isRaceScreen: true,
    isClassScreen: false,
  };

  const router = useHistory();

  // full user data
  const user = useContext(UserContext);

  // full races data
  const races = useContext(RacesContext);

  const currentCharacter = useContext(CurrentCharacterContext);

  // HTML templates
  const raceStats = Object.keys(selected).map((stat) => {
    return selected[stat].min ? (
      <li key={stat}>
        <h4>{statNames[stat]}</h4>
        {selected[stat].min} - {selected[stat].max}
      </li>
    ) : (
      ""
    );
  });

  // End of HTML templates

  const selectRace = (selected) => {
    const selectedRace = {
      ...racesList.filter((race) => race._id == selected)[0],
    };
    setSelected(selectedRace);
    updateCurrent(false, selectedRace);
    formatFeats([...selectedRace.feats]);
  };

  const formatFeats = (feats) => {
    let temp = [];

    feats.forEach((feat, index) => {
      temp.push({ name: feat, _id: index });
    });

    setFeats([...temp]);
  };

  const selectFeat = (_, feat) => {
    setFeat(feat);
    currentCharacter.dispatch({
      type: "UPDATE",
      payload: { racialFeat: feat },
    });
  };

  const choseClass = () => {
    if (xp) return;
    const raceData = updateCurrent(true, selected);

    router.push({
      pathname: "/chose-class",
      state: { race: raceData },
    });
  };

  const updateCurrent = (final, selected) => {
    if (!selected) return;
    const raceData = {
      str: selected.strData.min + added.str * final,
      con: selected.conData.min + added.con * final,
      dex: selected.dexData.min + added.dex * final,
      spd: selected.spdData.min + added.spd * final,
      will: selected.willData.min + added.will * final,
      magic: selected.magicData.min + added.magic * final,
      race: selected._id,
      raceName: selected.name,
      racialFeat: feat,
      divineKnowledge: final ? added.divineKnowledge : 0,
      magicalKnowledge: final ? added.magicalKnowledge : 0,
      fightingKnowledge: final ? added.fightingKnowledge : 0,
      practicalKnowledge: final ? added.practicalKnowledge : 0,
      teoreticalKnowledge: final ? added.teoreticalKnowledge : 0,
    };
    currentCharacter.dispatch({ type: "UPDATE", payload: raceData });
    return raceData;
  };

  useEffect(() => {
    if (!races.data.list) return;
    setRacesList([...races.data.list]);
  }, [races]);

  useEffect(() => {
    if (!racesList[0]) return;
    selectRace(racesList[0]._id);
  }, [racesList]);

  useEffect(() => {
    if (!feats[0]) return;
    selectFeat(0, feats[0]);
  }, [feats]);

  useEffect(() => {
    races.getRaces(user.data.token).catch(() => router.push("/"));

    // reset the current char
    currentCharacter.dispatch({
      type: "RESET",
    });
  }, [user]);

  return (
    <section className="race">
      <div className="race__current card">
        <InfoBlock
          text="Избери раса, расово качество и разпрдели 10 точки опит към статистиките си"
          heading="Избор на раса"
        />

        <div className="race__selects">
          <Select options={racesList} change={selectRace} />
          <Select options={feats} change={selectFeat} />
          <Button
            click={choseClass}
            class={"page__btn btn_sticky"}
            text="Следващо"
          />
        </div>

        <div className="race__stats">
          <h3>Статистики</h3>
          <ul className="race__list">{raceStats}</ul>
        </div>
      </div>

      <Character
        flags={characterSetup}
        changeXp={(xp) => setXp(xp)}
        xpPoints={10}
        hideSkills={true}
        changeAdded={(added) => setAdded(added)}
      />
    </section>
  );
};

export default ChoseRace;
