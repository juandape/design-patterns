import { JSX, useState } from "react";

interface ToggleProps {
  children: (props: { on: boolean; toggle: () => void }) => JSX.Element;
}

export const Toggle = ({children}: ToggleProps) => {
  const [on, setOn] = useState(false);

  const toggle = () => setOn(!on);

  return children({ on, toggle });
}