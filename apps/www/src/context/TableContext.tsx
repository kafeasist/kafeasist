import React from "react";
import { Table } from "@prisma/client";
import { UseTRPCQueryResult } from "@trpc/react-query/shared";

import { useCompany } from "~/hooks/use-company";
import { api } from "~/utils/api";

type TableContextType = {
  tables: Table[];
  tablesByPlaceId: Table[];
  setTables: (tables: Table[]) => void;
  addTable: (table: Table) => void;
  removeTable: (tableId: number) => void;
  getTableById: (tableId: number) => Table | undefined;
  fetchTablesByPlaceId: (placeId: number) => UseTRPCQueryResult<any, any>;
  fetchAllTables: () => UseTRPCQueryResult<any, any>;
};

export const TableContext = React.createContext<TableContextType | null>(null);

type TableProviderProps = {
  children?: React.ReactNode;
};

const TableProvider = ({ children }: TableProviderProps) => {
  const [currentTables, setCurrentTables] = React.useState<Table[]>([]);
  const [currentTablesByPlaceId, setCurrentTablesByPlaceId] = React.useState<
    Table[]
  >([]);
  const { selectedCompany } = useCompany();

  const setTables = React.useCallback(
    (tables: Table[]) => setCurrentTables(tables),
    [currentTables],
  );

  const addTable = React.useCallback(
    (table: Table) => {
      setCurrentTables((currentTables) => {
        if (currentTables === null) return [table];
        return [...currentTables, table];
      });
    },
    [currentTables],
  );

  const removeTable = React.useCallback(
    (tableId: number) => {
      setCurrentTables((currentTables) => {
        if (currentTables === null) return [];
        return currentTables.filter((t) => t.id !== tableId);
      });
    },
    [currentTables],
  );

  const getTableById = (tableId: number) => {
    return currentTables.find((t) => t.id === tableId);
  };

  const fetchTablesByPlaceId = React.useCallback(
    (placeId: number) => {
      return api.table.getByPlaceId.useQuery(
        { placeId },
        {
          enabled: currentTables.length == 0 && placeId !== -1,
          onSuccess: (data) => {
            if (data.tables) {
              setCurrentTablesByPlaceId(data.tables!);
            }
          },
        },
      );
    },
    [currentTables],
  );

  const fetchAllTables = React.useCallback(() => {
    const companyId = selectedCompany?.id ?? -1;

    return api.table.getAll.useQuery(
      { companyId },
      {
        enabled: currentTables.length == 0 && companyId !== -1,
        onSuccess: (data) => {
          if (data.tables) {
            setCurrentTables(data.tables!);
          }
        },
      },
    );
  }, [selectedCompany, currentTables]);

  return (
    <TableContext.Provider
      value={{
        tables: currentTables,
        tablesByPlaceId: currentTablesByPlaceId,
        setTables,
        addTable,
        removeTable,
        getTableById,
        fetchTablesByPlaceId,
        fetchAllTables,
      }}
    >
      {children}
    </TableContext.Provider>
  );
};

export default TableProvider;
