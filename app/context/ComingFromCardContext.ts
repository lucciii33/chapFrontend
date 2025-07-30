// src/context/ComingFromCardContext.ts
import { useState } from "react";

export const useComingFromCardContext = () => {
  const [comingFromCardButton, setComingFromCardButton] = useState(false);

  return {
    comingFromCardButton,
    setComingFromCardButton,
  };
};
