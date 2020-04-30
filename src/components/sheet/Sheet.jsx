import React, { useContext, useEffect } from "react";
import { CurrentCharacterContext } from "../../Context/currentCharacterContext";
import { UserContext } from "../../Context/userContext";
import { useParams, useHistory } from "react-router-dom";

import Character from "../character/Character.jsx";

import "./sheet.scss";

export default function Sheet(props) {
  const router = useHistory();
  const { id } = useParams();

  const character = useContext(CurrentCharacterContext);
  const user = useContext(UserContext);

  const characterSetup = {
    isCreating: false,
    isRaceScreen: false,
    isClassScreen: false,
  };

  useEffect(() => {
    character
      .getCurrentCharacter(user.data.token, id)
      .catch(() => router.push("/"));
  }, [user]);

  return (
    <div className="charsheet">
      <Character flags={characterSetup} xpPoints={0} />
    </div>
  );
}
