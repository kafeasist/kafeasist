import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { valueFormatter } from "~/utils/value-formatter";
import { Button } from "../ui/button";
import { HelpTooltip } from "../ui/help-tooltip";
import { InfoCard, Severity } from "../ui/info-card";
import { Progress as ProgressUI } from "../ui/progress";

export const Progress = () => {
  const goal = 20000;
  const current = 27253.42;
  let actualPercentage = (current / goal) * 100;

  const [percentage, setPercentage] = useState<number>(actualPercentage / 8);

  useEffect(() => {
    const timer = setTimeout(
      () => setPercentage(actualPercentage > 100 ? 100 : actualPercentage),
      300,
    );
    return () => clearTimeout(timer);
  }, []);

  let color = "bg-lime-500";

  if (actualPercentage < 25) {
    color = "bg-red-700 dark:bg-red-500";
  } else if (actualPercentage < 50) {
    color = "bg-orange-500";
  } else if (actualPercentage < 75) {
    color = "bg-yellow-500";
  } else if (actualPercentage >= 100) {
    color = "bg-emerald-500";
  }

  const goalLeft = goal - current;

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span>Günlük ciro hedefi</span>
          <HelpTooltip text="Bu hedef yapay zeka tarafından koyulan günlük hedefinizdir. İşletmeniz büyüdükçe hedef de buna uygun değişebilir." />
        </div>
      </div>
      <div className="mt-2 flex justify-between text-muted-foreground">
        <span>
          {valueFormatter(current)} &bull; %{actualPercentage.toFixed(2)}
        </span>
        <span>{valueFormatter(goal)}</span>
      </div>
      <ProgressUI color={color} value={percentage} className="mt-3" />
      <span className="text-xs text-muted-foreground">
        {goalLeft <= 0
          ? "Hedefinize ulaştınız 🎉"
          : `Hedefinize ulaşmanıza ${valueFormatter(goalLeft)} kaldı.`}
      </span>
    </>
  );
};

export const GeneralScore = () => {
  const actualScore = 56;

  const [score, setScore] = useState<number>(actualScore / 8);

  useEffect(() => {
    const timer = setTimeout(() => setScore(actualScore), 300);
    return () => clearTimeout(timer);
  }, []);

  let comment = "İşletmenizin durumu çok iyi 🎉";

  if (score < 25) {
    comment =
      "İşletmenizin durumu kötü. İşletmenizdeki verileri kontrol edin ve satışlarınızı artırmaya çalışın.";
  } else if (score < 50) {
    comment =
      "İşletmenizin durumu ortalama, ancak daha iyi olabilir. Analiz yapmayı deneyin.";
  } else if (score < 75) {
    comment =
      "İşletmenizin durumu ortalamadan iyi. Geliştirmek istiyorsanız analiz yapmayı unutmayın.";
  }

  let color = "bg-lime-500";

  if (actualScore < 25) {
    color = "bg-red-700 dark:bg-red-500";
  } else if (actualScore < 50) {
    color = "bg-orange-500";
  } else if (actualScore < 75) {
    color = "bg-yellow-500";
  } else if (actualScore >= 100) {
    color = "bg-emerald-500";
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span>Genel skor</span>
          <HelpTooltip text="Bu skor yapay zeka tarafından işletmenize verilen genel skordur." />
        </div>
      </div>
      <div className="mt-2 flex justify-between text-muted-foreground">
        <span>{actualScore} / 100</span>
      </div>
      <ProgressUI color={color} value={score} className="mt-3" />
      <span className="text-xs text-muted-foreground">{comment}</span>
    </>
  );
};

export const Suggestions = () => {
  const suggestions: {
    title: string;
    severity: Severity;
    description: string;
    action?: string;
    href?: string;
  }[] = [
    {
      title: "Bazı ürünlerinizin fiyatları çok yüksek",
      severity: "warning",
      description:
        "İşletmenizdeki bazı ürünlerin fiyatları çok yüksek. Bu durum müşterilerinizi kaçırmanıza neden olabilir.",
      action: "Düzenle",
      href: "/panel/urunler/1/detay",
    },
  ];

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span>Dikkat edin</span>
          <HelpTooltip text="Yapay zeka tarafından oluşturulmuş işletmenize ait kilit noktalardır ve dikkat edilmesi önerilir." />
        </div>
        <Link href="#">
          <Button variant="link" className="text-xs text-muted-foreground">
            Tümünü gör <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
      <div className="space-y-4">
        {suggestions.map((suggestion) => (
          <InfoCard
            key={suggestion.title}
            title={suggestion.title}
            severity={suggestion.severity}
          >
            {suggestion.description}
          </InfoCard>
        ))}
      </div>
    </>
  );
};

export const Status = () => {
  return (
    <div className="space-y-2">
      <Progress />
      <GeneralScore />
      <Suggestions />
    </div>
  );
};
