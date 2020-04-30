import React, { useContext, useEffect } from "react";
import Character from "../character/Character.jsx";
import { useHistory } from "react-router-dom";
import { CurrentCharacterContext } from "../../Context/currentCharacterContext";
import InfoBlock from "../infoBlock/InfoBlock";

const Finalise = () => {
  const CurrentCharacter = useContext(CurrentCharacterContext);
  const router = useHistory();

  const characterSetup = {
    isCreating: true,
    isRaceScreen: false,
    isClassScreen: false,
  };

  useEffect(() => {
    if (!CurrentCharacter.data.raceName) router.push("chose-race");
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <div className="race__current card">
        <InfoBlock
          text="Избери име на героя, общи качества и умения както и 80 точки опит към уменията."
          heading="Финализирай"
        />
      </div>
      <Character flags={characterSetup} xpPoints={80} />
    </div>
  );
};

export default Finalise;
