import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../Context/userContext";
import { useHistory } from "react-router-dom";
import "./profile.scss";

import Button from "../button/Button.jsx";

const Profile = () => {
  const [characters, setCharacters] = useState([]);
  const router = useHistory();
  const user = useContext(UserContext);

  const createChar = () => {
    router.push("/chose-race");
  };

  const openChar = (id) => {
    router.push("/character/" + id);
  };

  const allCharacters = characters.map((character) => (
    <li
      className="card profile__char"
      onClick={() => {
        openChar(character._id);
      }}
      key={character._id}
    >
      <span>Име: {character.name}</span>
      <span>Раса: {character.race.name}</span>
      <span>Клас: {character.class.name}</span>
    </li>
  ));

  useEffect(() => {
    if (!user.data.characters[0]) user.getChars().catch(() => router.push("/"));
    else setCharacters(user.data.characters);
  }, [user]);

  return (
    <div className="profile card">
      <h2>User Profile</h2>
      <h3>Characters</h3>
      <ul className="profile__chars">{allCharacters}</ul>
      <Button text="Create new" click={createChar} />
    </div>
  );
};

export default Profile;
