import React, { useCallback, useState } from "react";

interface ITogglerProps {
  value?: boolean;
  handleToggle?: (val: boolean) => void;
}

const empty = () => {};

const TogglerComponent: React.FC<ITogglerProps> = ({
  value = false,
  handleToggle = empty
}) => {
  const [s, setS] = useState();
  console.log("a", value);
  const onToggle = (e: any) => {
    console.log("wooot");
    // setS(10);
    handleToggle(!value);
  };
  return <div onClick={onToggle}>{value.toString()}</div>;
};

export const Toggler = React.memo(TogglerComponent);
