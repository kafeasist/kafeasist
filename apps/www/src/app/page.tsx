import { Avatar, Button, Input, Skeleton, Tooltip } from "@kafeasist/ui";

export default function Home() {
  return (
    <div className="mx-auto w-3/4 space-y-4 pt-12">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold">Avatar:</h1>
        <Avatar
          src="https://avatars.githubusercontent.com/u/40181789?v=4"
          alt="avatar"
        />
        <Avatar placeholder="AV" alt="avatar" />
      </div>
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold">Skeleton:</h1>
        <Skeleton className="h-6 w-24" />
        <Skeleton rounded className="h-6 w-6" />
      </div>
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold">Tooltip:</h1>
        <Tooltip text="Hello, I'm tooltip!">
          <p>Hover me!</p>
        </Tooltip>
        <Tooltip side="bottom" text="Hello, I'm bottom tooltip!">
          <p>Hover me for bottom!</p>
        </Tooltip>
      </div>
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold">Button:</h1>
        <Button>Hello from button!</Button>
        <Button size="lg">Hello from button!</Button>
        <Button size="sm">Hello from button!</Button>
        <Button variant={"outline"}>Hello from button!</Button>
      </div>
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold">Input:</h1>
        <Input />
        <Input type="password" />
      </div>
    </div>
  );
}
