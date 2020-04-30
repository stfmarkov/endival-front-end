import React, { useState } from "react";
import Popup from "../popup/Popup.jsx";
import Input from "../input/Input.jsx";
import Button from "../button/Button.jsx";
import "./experience.scss";

/*
    Props
    xp - property, the xp ponts 
    add - method, 1 param of type Number
*/

export default function Experience(props) {
  const [points, setPoints] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const changePoints = (value) => {
    setPoints(value * 1);
  };

  const add = (modif) => {
    props.add(points * modif);
    setIsOpen(false);
    setPoints("");
  };

  return (
    <div className="experience">
      Свободни точки опит: <span>{props.xp}</span>
      <Button
        click={() => setIsOpen(true)}
        class={"btn_small"}
        text={"Добави"}
      />
      <Popup open={isOpen}>
        <div className="row">
          <h3>Добави точки опит</h3>
          <Input value={points} change={changePoints} />
        </div>
        <div className="row">
          <p>Заслужи ли си ги?</p>
          <Button click={() => add(1)} class={"btn_small"} text={"Добави"} />
          <Button click={() => add(-1)} class={"btn_small"} text={"Извади"} />
        </div>
      </Popup>
    </div>
  );
}
