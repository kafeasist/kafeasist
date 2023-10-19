import { useContext } from "react";

import { PlaceContext } from "~/context/PlaceContext";

export const usePlace = () => {
  return (
    useContext(PlaceContext) ||
    (() => {
      throw new Error("usePlace must be used within a PlaceProvider");
    })()
  );
};
