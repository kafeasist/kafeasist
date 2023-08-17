import { Button } from "./button";
import { ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

interface BackButtonProps {
  href: string;
}

export const BackButton = ({ href }: BackButtonProps) => {
  const searchParams = useSearchParams();
  const { push } = useRouter();

  const ref = searchParams.get("ref");

  const sendBack = () => {
    if (!ref) push(href);
    else push(ref);
  };

  return (
    <Button onClick={sendBack} variant="link">
      <ArrowLeft className="mr-2 h-4 w-4" />
      <span>Geri dön</span>
    </Button>
  );
};
