import React, { useState, useEffect } from "react";
import "./money.scss";

import Popup from "../popup/Popup.jsx";
import Input from "../input/Input.jsx";
import Button from "../button/Button";

export default function Money(props) {
  const [money, setMoney] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const changeMoney = (value) => {
    setMoney(value * 1);
  };

  const modify = (modifier) => {
    const newMoney = props.money + money * modifier;
    props.modify(newMoney);
    setIsOpen(false);
    setMoney(0);
  };

  return (
    <div className="money">
      <Popup open={isOpen && !props.readOnly}>
        <h3>Кристали</h3>
        <Input value={money} change={changeMoney} />
        <Button click={() => modify(1)} text="Добави" class="btn_small" />
        <Button click={() => modify(-1)} text="Извади" class="btn_small" />
      </Popup>
      <div onClick={() => setIsOpen(true)}>Кристали: {props.money}</div>
    </div>
  );
}
