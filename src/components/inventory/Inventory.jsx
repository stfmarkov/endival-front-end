import React, { useState, useEffect } from "react";

import "./inventory.scss";
import ItemCreator from "../itemCreator/ItemCreator";
import Item from "../item/Item";
import Gear from "../gear/Gear";
import TempStat from "../tempStat/TempStat";
import Money from "../money/Money";

const Inventory = (props) => {
  const [items, setItems] = useState([]);
  const [money, setMoney] = useState(0);
  const [tab, setTabs] = useState(1);
  const [weight, setWeight] = useState({ current: 0, max: 0 });

  const equipedItems = () => {
    return items.filter((item) => item.equiped);
  };

  const calcCurrentWeight = () => {
    return items.reduce(
      (fullWeight, item) =>
        (fullWeight * 1 + (item.weight || 0) * item.qty).toFixed(2),
      0
    );
  };

  const updateItem = (item, index) => {
    let tempItems = [...items];
    tempItems[index] = { ...item };

    if (item.qty < 1) tempItems.splice(index, 1);

    setItems([...tempItems]);
    props.save([...tempItems]);
  };

  const equip = (item, index) => {
    const itemType = item.gearType.type;

    const numOfItems =
      item.gearType.type === "foot" ||
      item.gearType.type === "leg" ||
      item.gearType.type === "arm" ||
      item.gearType.type === "hand" ||
      item.gearType.type.includes("held")
        ? 2
        : 1;

    let found = 0;

    let tempItem = { ...item };
    let tempItems = [...items];
    tempItems = tempItems.map((item) => {
      if (!item.gearType) return item;
      if (item.gearType.type === itemType) {
        found += 1;
        if (found >= numOfItems) item.equiped = false;
      }
      return item;
    });

    setItems([...tempItems]);

    tempItem.equiped = true;

    updateItem(tempItem, index);
  };

  const unequip = (item, index) => {
    let tempItem = item;
    tempItem.equiped = false;

    updateItem(tempItem, index);
  };

  const changeTab = (tab) => {
    setTabs(tab);
    props.change();
  };

  const itemsTemplate = items.map((item, index) => (
    <Item
      key={index}
      equip={(item) => equip(item, index)}
      unequip={(item) => unequip(item, index)}
      updateItem={(item) => {
        updateItem(item, index);
      }}
      item={{ ...item }}
    />
  ));

  useEffect(() => {
    setItems(props.items);
  }, [props.items]);

  useEffect(() => {
    setMoney(props.money);
  }, [props.money]);

  useEffect(() => {
    setWeight({ ...weight, current: calcCurrentWeight() });
  }, [items]);

  useEffect(() => {
    setWeight({ current: calcCurrentWeight(), max: props.weight });
  }, [props.weight]);

  return (
    <div className="inventory">
      <div className="inventory__tabs">
        <div
          className={
            "inventory__tab card " + (tab == 1 ? "inventory__tab_active" : "")
          }
        >
          <div
            className="inventory__sticy inventory__sticy_1"
            onClick={() => changeTab(1)}
          >
            Нов Предмет
          </div>
          <div className="character__tab-wrapper">
            <ItemCreator
              addItem={(item) => {
                props.save([...items, item]);
              }}
            />
          </div>
        </div>
        <div
          className={
            "inventory__tab card " + (tab == 2 ? "inventory__tab_active" : "")
          }
        >
          <div
            className="inventory__sticy inventory__sticy_2"
            onClick={() => changeTab(2)}
          >
            Екипировка
          </div>
          <div className="character__tab-wrapper">
            <Gear items={equipedItems()} />
          </div>
        </div>
        <div
          className={
            "inventory__tab card " + (tab == 3 ? "inventory__tab_active" : "")
          }
        >
          <div
            className="inventory__sticy inventory__sticy_3"
            onClick={() => changeTab(3)}
          >
            Раница
          </div>

          <div className="character__tab-wrapper">
            <TempStat
              stat={weight}
              readOnly={true}
              name="Товар"
              color="#445c3c"
              modify={(weight) => setWeight(weight)}
            />

            <Money money={money} modify={(money) => props.saveMoney(money)} />

            <ul>{itemsTemplate}</ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
