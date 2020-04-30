import React, { useState, useEffect } from "react";
import "./select.scss";

/*
    Props list:
        options: list of options of type object, should have name property
*/

const Select = (props) => {
  const [selected, setSelected] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [classList, setClassList] = useState("");

  const options = props.options.map((option) => (
    <li
      className="select__item"
      onClick={() => {
        change(option._id, option);
      }}
      key={option.name}
    >
      {option.name}
    </li>
  ));

  const change = (id, option) => {
    props.change(id, option);
    const selectedItem = props.options.filter((item) => item._id === id)[0];
    setSelected({ ...selectedItem });
    close();
  };

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    let belongs = true;
    if (!(!props.options[0] || selected.name)) setSelected(props.options[0]);
    if (props.options[0]) {
      belongs = !!props.options.filter(
        (option) => option.name == selected.name
      )[0];
    }
    if (!belongs) setSelected(props.options[0]);
  }, [props]);

  useEffect(() => {
    const classes = isOpen ? "select_open" : "";
    setClassList(classes);
  }, [isOpen]);

  return (
    <div className="select__wrapper">
      <ul className={"card select " + classList}>
        <li className="select__selected" onClick={open}>
          {selected.name}
        </li>
        {options}
      </ul>
    </div>
  );
};

export default Select;
