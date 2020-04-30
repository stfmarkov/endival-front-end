import React, { useState } from "react";
import "./tempStat.scss";

import Popup from "../popup/Popup.jsx";
import Input from "../input/Input.jsx";

/*
Props list:
stat: the stat data, max and current values. Type object
name: The name of the stat. Type string
color: The color for the inner bar. Type string - should be "#" + hex value
*/

export default function TempStat(props) {
  const [points, setPoints] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const changePoints = (value) => {
    setPoints(value * 1);
  };

  const modify = (modifier) => {
    const newPoints = props.stat.current + points * modifier;
    if (newPoints > props.stat.max) return;
    props.modify({ current: newPoints, max: props.stat.max });
    setIsOpen(false);
    setPoints("");
  };

  return (
    <div className="temp-stat">
      <Popup open={isOpen && !props.readOnly}>
        <h3>Промени статистика</h3>
        <Input value={points} change={changePoints} />
        <button onClick={() => modify(1)}>Добави</button>
        <button onClick={() => modify(-1)}>Извади</button>
      </Popup>
      <span>{props.name}</span>
      <div className="temp-stat__base" onClick={() => setIsOpen(true)}>
        <div
          className="temp-stat__inner"
          style={{ backgroundColor: props.color }}
        ></div>
        <div className="temp-stat__text">
          {props.stat.current} / {props.stat.max}
        </div>
      </div>
    </div>
  );
}
