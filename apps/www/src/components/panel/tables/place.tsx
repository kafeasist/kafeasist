import { Card, CardContent } from "~/components/ui/card";
import { Spinner } from "~/components/ui/spinner";
import { useTable } from "~/hooks/use-table";
import TableElement from "./table";

const Place = ({ id }: { id: number }) => {
  const { tablesByPlaceId, fetchTablesByPlaceId } = useTable();

  const { isLoading } = fetchTablesByPlaceId(id);

  console.log(tablesByPlaceId);

  return (
    <Card className="mt-4 h-[36rem] bg-muted">
      {!!isLoading ? (
        <Spinner />
      ) : (
        <CardContent className="flex space-x-2">
          {tablesByPlaceId.map((table) => (
            <TableElement
              key={table.id}
              available={table.isAvailable}
              name={table.name}
            ></TableElement>
          ))}
        </CardContent>
      )}
    </Card>
  );
};

export default Place;
