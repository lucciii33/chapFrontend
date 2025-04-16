// src/context/ComingFromCardContext.ts
import { useState } from "react";

export const useComingFromCardContext = () => {
  const [comingFromCardButton, setComingFromCardButton] = useState(false);
  console.log("comingFromCardButton", comingFromCardButton)

  return {
    comingFromCardButton,
    setComingFromCardButton,
  };
};
