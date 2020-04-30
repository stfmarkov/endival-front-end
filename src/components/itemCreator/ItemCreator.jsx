import React, { useState, useEffect } from "react";
import Input from "../input/Input";
import Select from "../select/Select";
import Button from "../button/Button";
import "./itemCreator.scss";

export default function ItemCreator(props) {
  //   Item types
  const stats = [
    { name: "М", type: "piercing" },
    { name: "C", type: "slashing" },
    { name: "T", type: "blunt" },
  ];

  const armorSpecific = [
    {
      name: "Вид",
      type: "armorType",
      list: [
        { _id: 1, name: "Шлем", type: "head" },
        { _id: 2, name: "Нараменник", type: "arm" },
        { _id: 3, name: "Ризница", type: "mail" },
        { _id: 4, name: "Нагръдник", type: "plate" },
        { _id: 5, name: "Ръкавица", type: "hand" },
        { _id: 6, name: "Набедреник", type: "leg" },
        { _id: 7, name: "Ботуш", type: "foot" },
      ],
    },
  ];

  const weaponSpecific = [
    {
      name: "Вид",
      type: "weaponType",
      list: [
        { _id: 1, name: "Едноръчно", type: "held1" },
        { _id: 2, name: "Двуръчно", type: "held2" },
      ],
    },
  ];

  const general = {
    _id: 1,
    name: "Общ",
    type: "general",
  };

  const armor = {
    _id: 2,
    name: "Броня",
    type: "armor",
    stats: [...stats, ...armorSpecific],
  };

  const weapon = {
    _id: 3,
    name: "Оръжие",
    type: "weapon",
    stats: [...stats, ...weaponSpecific],
  };

  const shield = {
    _id: 4,
    name: "Щит",
    type: "shield",
    stats: [
      { name: "ЗБ", type: "blockBonus" },
      {
        name: "Щит",
        type: "shieldType",
        list: [
          { _id: 1, name: "Малък", type: "held1" },
          { _id: 2, name: "Голям", type: "held1" },
        ],
      },
    ],
  };

  const [item, setItem] = useState({ name: "", weight: "" });
  const [itemType, setItemType] = useState(general);
  const [itemStats, setItemStats] = useState([]);
  const [itemTypes, setItemTypes] = useState([general, armor, weapon, shield]);

  const addStats = itemStats.map((stat) => {
    if (itemType == "generel") return;

    return (
      <div
        key={stat.name}
        className={"item-creator__stat item-creator__stat_" + stat.type}
      >
        {stat.list ? (
          <Select
            options={stat.list}
            change={(id, selected) => selectGearType(selected)}
          />
        ) : (
          <React.Fragment>
            <span>{stat.name}</span>
            <Input
              placeholder={stat.name}
              value={
                String(item[stat.type]) !== "undefined" ? item[stat.type] : "0"
              }
              change={(val) => updateItem(stat.type, val)}
            />
          </React.Fragment>
        )}
      </div>
    );
  });

  const changeItem = (value) => {
    setItem({ ...item, name: value });
  };

  const updateItem = (type, value) => {
    value = value * 1;
    if (isNaN(value)) return;
    const updated = { ...item };
    updated[type] = value;
    setItem({ ...updated });
  };

  const addItem = () => {
    if (!item.name) return;
    props.addItem({ ...item, itemType, qty: 1, equiped: false });

    resetAll();
  };

  const resetAll = () => {
    selectItemType(general);
    setItem({ name: "", weight: "" });
    setItemTypes([general]);
    setTimeout(() => {
      setItemTypes([general, armor, weapon, shield]);
    }, 1);
  };

  const addWeight = (value) => {
    if (isNaN(value)) value = 0;
    setItem({ ...item, weight: value });
  };

  const selectItemType = (selected) => {
    setItemType(selected);
    setItemStats(selected.stats || []);

    if (selected.type === "general") selectGearType({});
    else selectGearType(selected.stats[selected.stats.length - 1].list[0]);
  };

  const selectGearType = (selected) => {
    setItem({ ...item, gearType: selected });
  };

  return (
    <div className="item-creator">
      <div className="row">
        <div className="item-creator__name">
          Име на предмета:
          <Input
            type="text"
            placeholder="Нов предмет"
            value={item.name}
            change={changeItem}
          />
        </div>
        <div className="item-creator__weight">
          Тегло:
          <Input
            type="text"
            placeholder="Тегло"
            value={item.weight}
            change={addWeight}
          />
        </div>
      </div>
      <div className="row item-creator__selector">
        <span>Тип:</span>
        <Select
          options={itemTypes}
          change={(id, selected) => selectItemType(selected)}
        />
      </div>
      <div className="row item-creator__selector">
        <span>Подтип:</span> {addStats}
      </div>
      <Button click={addItem} text={"Добави"} class={"btn_small"} />
    </div>
  );
}
