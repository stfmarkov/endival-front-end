import React, { useState, useEffect } from "react";

import "./gear.scss";

export default function Gear({ items }) {
  const [torsoDef, setTorsoDef] = useState({
    piercing: 0,
    slashing: 0,
    blunt: 0,
  });
  const [leftLegDef, setLeftLegDef] = useState({
    piercing: 0,
    slashing: 0,
    blunt: 0,
  });
  const [rightLegDef, setRightLegDef] = useState({
    piercing: 0,
    slashing: 0,
    blunt: 0,
  });
  const [leftArmDef, setLeftArmDef] = useState({
    piercing: 0,
    slashing: 0,
    blunt: 0,
  });
  const [rightArmDef, setRightArmDef] = useState({
    piercing: 0,
    slashing: 0,
    blunt: 0,
  });

  const [fullDef, setFullDef] = useState({
    piercing: 0,
    slashing: 0,
    blunt: 0,
  });

  const calcPartDef = (part1name, part2name, side, partModif, setItem) => {
    // part1Name - the name of the fitst part of the set
    // part2Name - the name of the second part of the set
    // side - 0 for left side or no side in case of torso and 1 for right side
    // partModif - some part1 items are made of multiple parts. thats how many they are
    // a set function for the state
    const part1Piercing = equipedGear(part1name)[side]
      ? equipedGear(part1name)[side].piercing * partModif
      : 0;
    const part1Slashing = equipedGear(part1name)[side]
      ? equipedGear(part1name)[side].slashing * partModif
      : 0;
    const part1Blunt = equipedGear(part1name)[side]
      ? equipedGear(part1name)[side].blunt * partModif
      : 0;

    const part2Piercing = equipedGear(part2name)[side]
      ? equipedGear(part2name)[side].piercing
      : 0;
    const part2Slashing = equipedGear(part2name)[side]
      ? equipedGear(part2name)[side].slashing
      : 0;
    const part2Blunt = equipedGear(part2name)[side]
      ? equipedGear(part2name)[side].blunt
      : 0;

    const piercing = Math.floor((part1Piercing + part2Piercing) / 2);
    const slashing = Math.floor((part1Slashing + part2Slashing) / 2);
    const blunt = Math.floor((part1Blunt + part2Blunt) / 2);

    setItem({ piercing, slashing, blunt });
  };

  const equipedGear = (type) => {
    const gear = items.filter((item) => item.gearType.type.includes(type));

    if (gear[0] && gear[0].gearType.type.split(type)[1] * 1 == 2) {
      gear.push(gear[0]);
    }

    return gear;
  };

  const calcFullDef = () => {
    const piercing = Math.floor(
      (torsoDef.piercing +
        leftArmDef.piercing +
        leftLegDef.piercing +
        rightArmDef.piercing +
        rightLegDef.piercing) /
        3
    );

    const slashing = Math.floor(
      (torsoDef.slashing +
        leftArmDef.slashing +
        leftLegDef.slashing +
        rightArmDef.slashing +
        rightLegDef.slashing) /
        3
    );

    const blunt = Math.floor(
      (torsoDef.blunt +
        leftArmDef.blunt +
        leftLegDef.blunt +
        rightArmDef.blunt +
        rightLegDef.blunt) /
        3
    );

    setFullDef({ piercing, slashing, blunt });
  };

  useEffect(() => {
    calcPartDef("mail", "plate", 0, 1, setTorsoDef);
    calcPartDef("leg", "foot", 0, 2, setLeftLegDef);
    calcPartDef("leg", "foot", 0, 2, setRightLegDef);
    calcPartDef("arm", "hand", 0, 2, setLeftArmDef);
    calcPartDef("arm", "hand", 0, 2, setRightArmDef);
  }, [items]);

  useEffect(() => {
    calcFullDef();
  }, [torsoDef, leftLegDef, leftArmDef, rightLegDef, rightArmDef]);

  return (
    <div className="gear">
      <div className="row">
        <div>
          <h2>Броня</h2>
          Oбщо: M {fullDef.piercing} / С {fullDef.slashing} / T{fullDef.blunt}
          <div className="gear__item">
            Tорс {torsoDef.piercing} / {torsoDef.slashing} /{torsoDef.blunt}
          </div>
          <div className="gear__item">
            Ляв крак {leftLegDef.piercing} / {leftLegDef.slashing} /
            {leftLegDef.blunt}
          </div>
          <div className="gear__item">
            Десен крак {rightLegDef.piercing} / {rightLegDef.slashing} /
            {rightLegDef.blunt}
          </div>
          <div className="gear__item">
            Лява ръка {leftArmDef.piercing} / {leftArmDef.slashing} /
            {leftArmDef.blunt}
          </div>
          <div className="gear__item">
            Дясна ръка {rightArmDef.piercing} / {rightArmDef.slashing} /
            {rightArmDef.blunt}
          </div>
        </div>
        <div>
          <div className="gear__item">
            <span>Глава - </span>
            {equipedGear("head")[0] ? equipedGear("head")[0].name : ""} - M
            {equipedGear("head")[0] ? equipedGear("head")[0].piercing : "0"} / С
            {equipedGear("head")[0] ? equipedGear("head")[0].slashing : "0"} / T
            {equipedGear("head")[0] ? equipedGear("head")[0].blunt : "0"}
          </div>
          <div className="gear__item">
            <span>Ризница - </span>
            {equipedGear("mail")[0] ? equipedGear("mail")[0].name : ""} - M
            {equipedGear("mail")[0] ? equipedGear("mail")[0].piercing : "0"} / С
            {equipedGear("mail")[0] ? equipedGear("mail")[0].slashing : "0"} / T
            {equipedGear("mail")[0] ? equipedGear("mail")[0].blunt : "0"}
          </div>
          <div className="gear__item">
            <span>Нагръдник - </span>
            {equipedGear("plate")[0] ? equipedGear("plate")[0].name : ""} - M
            {equipedGear("plate")[0] ? equipedGear("plate")[0].piercing : "0"} /
            С{equipedGear("plate")[0] ? equipedGear("plate")[0].slashing : "0"}/
            T{equipedGear("plate")[0] ? equipedGear("plate")[0].blunt : "0"}
          </div>
          <div className="gear__item">
            <span>Ръка - </span>
            {equipedGear("hand")[0] ? equipedGear("hand")[0].name : ""} - М
            {equipedGear("hand")[0] ? equipedGear("hand")[0].piercing : "0"} / С
            {equipedGear("hand")[0] ? equipedGear("hand")[0].slashing : "0"} / T
            {equipedGear("hand")[0] ? equipedGear("hand")[0].blunt : "0"}
          </div>
          <div className="gear__item">
            <span>Ръка - </span>
            {equipedGear("hand")[1] ? equipedGear("hand")[1].name : ""} - M
            {equipedGear("hand")[1] ? equipedGear("hand")[1].piercing : "0"} / С
            {equipedGear("hand")[1] ? equipedGear("hand")[1].slashing : "0"} / T
            {equipedGear("hand")[1] ? equipedGear("hand")[1].blunt : "0"}
          </div>
          <div className="gear__item">
            <span>Крак - </span>
            {equipedGear("leg")[0] ? equipedGear("leg")[0].name : ""} - M
            {equipedGear("leg")[0] ? equipedGear("leg")[0].piercing : "0"} / С
            {equipedGear("leg")[0] ? equipedGear("leg")[0].slashing : "0"} / T
            {equipedGear("leg")[0] ? equipedGear("leg")[0].blunt : "0"}
          </div>
          <div className="gear__item">
            <span>Крак - </span>
            {equipedGear("leg")[1] ? equipedGear("leg")[1].name : ""} - M
            {equipedGear("leg")[1] ? equipedGear("leg")[1].piercing : "0"} / С
            {equipedGear("leg")[1] ? equipedGear("leg")[1].slashing : "0"} / T
            {equipedGear("leg")[1] ? equipedGear("leg")[1].blunt : "0"}
          </div>
          <div className="gear__item">
            <span>Ботуш - </span>
            {equipedGear("foot")[0] ? equipedGear("foot")[0].name : ""} - M
            {equipedGear("foot")[0] ? equipedGear("foot")[0].piercing : "0"} / С
            {equipedGear("foot")[0] ? equipedGear("foot")[0].slashing : "0"} / T
            {equipedGear("foot")[0] ? equipedGear("foot")[0].blunt : "0"}
          </div>
          <div className="gear__item">
            <span>Ботуш - </span>
            {equipedGear("foot")[1] ? equipedGear("foot")[1].name : ""} - M
            {equipedGear("foot")[1] ? equipedGear("foot")[1].piercing : "0"} / С
            {equipedGear("foot")[1] ? equipedGear("foot")[1].slashing : "0"} / T
            {equipedGear("foot")[1] ? equipedGear("foot")[1].blunt : "0"}
          </div>
        </div>
      </div>

      <div>
        <h2>Оръжия:</h2>
        <div className="gear__item">
          <span>Лява Ръка - </span>
          {equipedGear("held")[0] ? equipedGear("held")[0].name : ""} - M
          {equipedGear("held")[0] ? equipedGear("held")[0].piercing : "0"} / С
          {equipedGear("held")[0] ? equipedGear("held")[0].slashing : "0"} / T
          {equipedGear("held")[0] ? equipedGear("held")[0].blunt : "0"} /
          <div>
            Блокиране -
            {equipedGear("held")[1] && equipedGear("held")[0].blockBonus
              ? equipedGear("held")[0].blockBonus
              : "0"}
          </div>
        </div>
        <div className="gear__item">
          <span>Дясна Ръка - </span>
          {equipedGear("held")[1] ? equipedGear("held")[1].name : ""}- M
          {equipedGear("held")[1] ? equipedGear("held")[1].piercing : "0"} / С
          {equipedGear("held")[1] ? equipedGear("held")[1].slashing : "0"} / T
          {equipedGear("held")[1] ? equipedGear("held")[1].blunt : "0"} /
          <div>
            Блокиране -
            {equipedGear("held")[1] && equipedGear("held")[1].blockBonus
              ? equipedGear("held")[1].blockBonus
              : "0"}
          </div>
        </div>
      </div>
    </div>
  );
}
