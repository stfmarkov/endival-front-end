import React from "react";

export default function CharHeading(props) {
  return (
    <h2>
      {props.heading} :<span> {props.text}</span>
    </h2>
  );
}
