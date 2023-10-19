import { Card, CardContent } from "~/components/ui/card";
import { Spinner } from "~/components/ui/spinner";
import { useTable } from "~/hooks/use-table";
import TableElement from "./table";

const Place = ({ id }: { id: number }) => {
  const { tablesByPlaceId, fetchTablesByPlaceId } = useTable();

  const { isLoading } = fetchTablesByPlaceId(id);

  return (
    <Card className="mt-4 h-[36rem] bg-muted">
      {!!isLoading ? (
        <Spinner />
      ) : (
        <CardContent>
          {tablesByPlaceId.map((table) => (
            <TableElement key={table.id}></TableElement>
          ))}
        </CardContent>
      )}
    </Card>
  );
};

export default Place;
