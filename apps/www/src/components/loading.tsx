import { P } from "./ui/Typography/p";
import { Spinner, SpinnerProps } from "./ui/spinner";
import { useState } from "react";

interface LoadingProps extends SpinnerProps {}

export const Loading = (props: LoadingProps) => {
  const loadingPhrases = [
    "Birkaç saniye, hemen dönüyoruz!",
    "Biraz beklersen, güzel bir deneyim seni bekliyor!",
    "Sana en iyi hizmeti sunmak için yükleniyoruz!",
    "Biraz yavaş ama emin ol, beklemeye değecek!",
    "Yükleniyor... Sen de bir nefes al, gevşe!",
    "Yükleniyor... Ve sen de yükleniyorsun!",
    "Biraz beklersen, arkadaşlarınla yarışabilirsin!",
    "Yükleniyor... Sabır taşını oluşturuyoruz...",
  ];

  const randomLoadingPhrase =
    loadingPhrases[Math.floor(Math.random() * loadingPhrases.length)];

  const [tooLong, setTooLong] = useState(false);

  setTimeout(() => {
    setTooLong(true);
  }, 3000);

  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-4">
      <Spinner {...props} />
      {tooLong && <P>{randomLoadingPhrase}</P>}
    </div>
  );
};
