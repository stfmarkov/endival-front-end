import React from "react";
import "./loader.scss";

export default function Loader({ isShown }) {
  return <div className={"loader " + (isShown ? "loader_visible" : "")}></div>;
}
