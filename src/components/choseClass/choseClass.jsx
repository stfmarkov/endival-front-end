import React, { useContext, useState, useEffect } from "react";
import { ClassesContext } from "../../Context/classesContext";
import { UserContext } from "../../Context/userContext";
import { CurrentCharacterContext } from "../../Context/currentCharacterContext";
import { useHistory } from "react-router-dom";
import Character from "../character/Character.jsx";
import Button from "../button/Button.jsx";
import Select from "../select/Select.jsx";
import InfoBlock from "../infoBlock/InfoBlock.jsx";

import "./class.scss";

const ChoseClass = (props) => {
  const router = useHistory();

  const [selected, setSelected] = useState({});
  const [feats, setFeats] = useState([]);

  // Names of the stats. Use bulgarian by default
  const [statNames, setStatNames] = useState({
    str: "Сила",
    dex: "Ловкост",
    con: "Издражливост",
    will: "Воля",
    magic: "Ефирност",
    spd: "Бързина",
    divineKnowledge: "Духовно Познание",
    magicalKnowledge: "Ефирно Познание",
    fightingKnowledge: "Бойно Познание",
    practicalKnowledge: "Практическо Познание",
    teoreticalKnowledge: "Теоретично Познание",
  });

  const CurrentCharacter = useContext(CurrentCharacterContext);

  // The stats for the chosen race.
  const race = props.location.state ? props.location.state.race : {};

  const characterSetup = {
    isCreating: true,
    isRaceScreen: false,
    isClassScreen: true,
  };

  // The data for the classes
  const classData = useContext(ClassesContext);

  const user = useContext(UserContext);

  const selectClass = (selectedId) => {
    const chosen = classList.filter(
      (className) => className._id === selectedId
    )[0];
    let charData = {};

    for (const stat in CurrentCharacter.data) {
      if (!chosen.added || stat == "name") continue;

      const raceStat = race[stat] ? race[stat] : 0;

      const value = chosen.added[stat]
        ? raceStat + chosen.added[stat]
        : raceStat;

      charData[stat] = value;
    }

    formatFeats([...chosen.feats]);
    setSelected({ ...chosen.added });

    CurrentCharacter.dispatch({
      type: "UPDATE",
      payload: {
        name: CurrentCharacter.data.name,
        ...chosen.added,
        ...charData,
        class: chosen._id,
        className: chosen.name,
      },
    });
  };

  const selectFeat = (_, feat) => {
    CurrentCharacter.dispatch({ type: "UPDATE", payload: { classFeat: feat } });
  };

  const formatFeats = (feats) => {
    let temp = [];

    feats.forEach((feat, index) => {
      temp.push({ name: feat, _id: index });
    });

    setFeats([...temp]);
  };

  const finalise = () => {
    router.push("/finalise");
  };

  const classList = classData.data.list ? classData.data.list : [];

  // JSX
  const stats = Object.keys(selected).map((stat) => {
    return !(
      stat === "race" ||
      stat === "raceName" ||
      stat === "racialFeat"
    ) ? (
      <li className={"class__stat class__stat_" + stat} key={stat}>
        {" "}
        <h4>{statNames[stat]}</h4> {selected[stat]}{" "}
      </li>
    ) : (
      ""
    );
  });

  useEffect(() => {
    classData.getClasses(user.data.token).catch(() => router.push("/"));
  }, [user]);

  useEffect(() => {
    if (classList[0]) selectClass(classList[0]._id);
  }, [classData]);

  useEffect(() => {
    if (!feats[0]) return;
    selectFeat(0, feats[0]);
  }, [feats]);

  useEffect(() => {
    if (!CurrentCharacter.data.raceName) router.push("chose-race");
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="class">
      <div className="class__current card">
        <InfoBlock
          text="Избери клас и класово качество"
          heading="Избор на клас"
        />

        <div className="class__selects">
          <Select options={classList} change={selectClass} />
          <Select options={feats} change={selectFeat} />
          <Button
            text="Следващо"
            class={"page__btn btn_sticky"}
            click={finalise}
          />
        </div>

        <div className="class__stats">
          <h3>Статистики</h3>
          <ul className="class__list">{stats}</ul>
        </div>
      </div>

      <Character flags={characterSetup} xpPoints={0} hideSkills={true} />
    </section>
  );
};

export default ChoseClass;
