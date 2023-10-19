import React from "react";
import { Place } from "@prisma/client";
import { UseTRPCQueryResult } from "@trpc/react-query/shared";

import { useCompany } from "~/hooks/use-company";
import { api } from "~/utils/api";

type PlaceContextType = {
  places: Place[];
  firstPlace: Place | undefined;
  setPlaces: (places: Place[]) => void;
  addPlace: (place: Place) => void;
  removePlace: (placeId: number) => void;
  getPlaceById: (placeId: number) => Place | undefined;
  fetchAllPlaces: () => UseTRPCQueryResult<any, any>;
};

export const PlaceContext = React.createContext<PlaceContextType | null>(null);

type PlaceProviderProps = {
  children?: React.ReactNode;
};

const PlaceProvider = ({ children }: PlaceProviderProps) => {
  const [firstPlace, setFirstPlace] = React.useState<Place | undefined>();
  const [currentPlaces, setCurrentPlaces] = React.useState<Place[]>([]);
  const { selectedCompany } = useCompany();

  const setPlaces = React.useCallback(
    (places: Place[]) => setCurrentPlaces(places),
    [currentPlaces],
  );

  const addPlace = React.useCallback(
    (place: Place) => {
      setCurrentPlaces((currentPlaces) => {
        if (currentPlaces === null) return [place];
        return [...currentPlaces, place];
      });
    },
    [currentPlaces],
  );

  const removePlace = React.useCallback(
    (placeId: number) => {
      setCurrentPlaces((currentPlaces) => {
        if (currentPlaces === null) return [];
        return currentPlaces.filter((p) => p.id !== placeId);
      });
    },
    [currentPlaces],
  );

  const getPlaceById = (placeId: number) => {
    return currentPlaces.find((p) => p.id === placeId);
  };

  const fetchAllPlaces = React.useCallback(() => {
    const companyId = selectedCompany?.id ?? -1;

    return api.place.getAll.useQuery(
      { companyId },
      {
        enabled: currentPlaces.length == 0 && companyId !== -1,
        onSuccess: (data) => {
          if (data.places) {
            setCurrentPlaces(data.places!);
            setFirstPlace(data.places[0]);
          }
        },
      },
    );
  }, [selectedCompany, currentPlaces]);

  return (
    <PlaceContext.Provider
      value={{
        places: currentPlaces,
        firstPlace,
        setPlaces,
        addPlace,
        removePlace,
        getPlaceById,
        fetchAllPlaces,
      }}
    >
      {children}
    </PlaceContext.Provider>
  );
};

export default PlaceProvider;
