import {useEffect, useState} from "react";
import "./Checkbox.modules.scss";

interface CheckboxProps {
  onClick: (isChecked: boolean) => void;
  isChecked: boolean;
}

const Checkbox = ({onClick, isChecked}: CheckboxProps) => {
  const handleClick = () => {
    onClick(!isChecked);
  };

  return (
    <div
      className={`checkbox ${isChecked ? "active" : ""}`}
      onClick={handleClick}>
      <div className='circle'></div>
    </div>
  );
};

export default Checkbox;
