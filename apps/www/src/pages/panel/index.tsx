import { useProtected } from "~/hooks/useProtected";

const Panel = () => {
  useProtected();

  return <p>Panel</p>;
};

export default Panel;
