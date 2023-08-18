import { Loader2, LucideProps } from "lucide-react";
import { useState } from "react";

export interface SpinnerProps extends LucideProps {
  variant?: "simple" | "long";
}

const Spinner = (props: SpinnerProps) => {
  const TOO_LONG = 2000;

  const loadingPhrases = [
    "Birkaç saniye, hemen dönüyoruz!",
    "Biraz beklersen, güzel bir deneyim seni bekliyor!",
    "Sana en iyi hizmeti sunmak için yükleniyoruz!",
    "Biraz yavaş ama emin ol, beklemeye değecek!",
    "Yükleniyor... Sen de bir nefes al, gevşe!",
    "Yükleniyor... Ve sen de yükleniyorsun!",
    "Yükleniyor... Sabır taşını oluşturuyoruz...",
  ];

  const randomLoadingPhrase =
    loadingPhrases[Math.floor(Math.random() * loadingPhrases.length)];

  const [tooLong, setTooLong] = useState(false);

  setTimeout(() => {
    setTooLong(true);
  }, TOO_LONG);

  return (
    <div className="flex flex-col items-center justify-center space-y-2 text-center">
      <Loader2 className="animate-spin" {...props} />
      {tooLong && props.variant === "long" && <p>{randomLoadingPhrase}</p>}
    </div>
  );
};

export { Spinner };
