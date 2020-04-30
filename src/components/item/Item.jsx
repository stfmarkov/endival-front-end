import React from "react";
import "./item.scss";
import Button from "../button/Button";

export default function Item({ item, updateItem, equip, unequip }) {
  const updateQty = (modif) => {
    const tempItem = item;
    tempItem.qty = item.qty + modif;
    updateItem(tempItem);
  };

  return (
    <li className="item">
      {item.name}: {item.qty} бр. - тегло: {(item.qty * item.weight).toFixed(2)}
      <div className="item__stats">
        {item.piercing ? (
          <div className="item__stat">
            <span>M</span> {item.piercing}
          </div>
        ) : (
          ""
        )}
        {item.slashing ? (
          <div className="item__stat">
            <span>С</span> {item.slashing}
          </div>
        ) : (
          ""
        )}
        {item.blunt ? (
          <div className="item__stat">
            <span>T</span> {item.blunt}{" "}
          </div>
        ) : (
          ""
        )}
        {item.blockBonus ? (
          <div className="item__stat">
            <span>Блокиране</span> {item.blockBonus}
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="itemControls">
        <Button click={() => updateQty(1)} text={"+"} class={"btn_small"} />
        <Button click={() => updateQty(-1)} text={"-"} class={"btn_small"} />
        {item.itemType.type !== "general" && !item.equiped ? (
          <Button
            click={() => equip(item)}
            text={"Екипирай"}
            class={"btn_small"}
          />
        ) : (
          ""
        )}

        {item.equiped ? (
          <Button
            click={() => unequip(item)}
            text="Разекипирай"
            class="btn_small"
          />
        ) : (
          ""
        )}
      </div>
    </li>
  );
}
