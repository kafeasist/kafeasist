import { columns } from "~/components/panel/columns";
import { DataTable } from "~/components/panel/dataTable";
import { UserNav } from "~/components/panel/userNav";
import tasks from "~/data/tasks.json";

const Analiz = () => {
  return (
    <>
      <div className="flex h-full flex-1 flex-col space-y-8 p-8">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <UserNav
              user={{
                id: 0,
                firstName: "",
                lastName: "",
                phone: "",
                email: "",
                imageUrl: null,
                isVerified: false,
              }}
            />
          </div>
        </div>
        <DataTable data={tasks} columns={columns} />
      </div>
    </>
  );
};

export default Analiz;
