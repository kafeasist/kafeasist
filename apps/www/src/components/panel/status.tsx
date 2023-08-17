import { Button } from "../ui/button";
import { HelpTooltip } from "../ui/help-tooltip";
import {
  ProgressBar,
  type ProgressBarProps,
  CategoryBar,
  Callout,
} from "@tremor/react";
import { AlertCircle, ArrowRight, Info, XCircle } from "lucide-react";
import Link from "next/link";
import { valueFormatter } from "~/utils/value-formatter";

export const Progress = () => {
  const goal = 20000;
  const current = 17250.2;
  const percentage = (current / goal) * 100;

  let color: ProgressBarProps["color"] = "teal";

  if (percentage < 25) {
    color = "red";
  } else if (percentage < 50) {
    color = "orange";
  } else if (percentage < 75) {
    color = "yellow";
  } else if (percentage < 100) {
    color = "emerald";
  }

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
          {valueFormatter(current)} &bull; %{percentage.toFixed(2)}
        </span>
        <span>{valueFormatter(goal)}</span>
      </div>
      <ProgressBar value={percentage} color={color} className="mt-3" />
      <span className="text-xs text-muted-foreground">
        Hedefinize ulaşmanıza {valueFormatter(goal - current)} kaldı.
      </span>
    </>
  );
};

export const GeneralScore = () => {
  const score = 98;

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

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span>Genel skor</span>
          <HelpTooltip text="Bu skor yapay zeka tarafından işletmenize verilen genel skordur." />
        </div>
      </div>
      <CategoryBar
        values={[25, 25, 25, 25]}
        colors={["red", "orange", "yellow", "emerald"]}
        markerValue={score}
        tooltip={score.toFixed(0) + " / 100"}
        className="mt-3"
      />
      <span className="text-xs text-muted-foreground">{comment}</span>
    </>
  );
};

export const Suggestions = () => {
  type Severity = "warning" | "error" | "info";

  const suggestions: {
    title: string;
    severity: Severity;
    description: string;
  }[] = [
    {
      title: "Bazı ürünlerinizin fiyatları çok yüksek",
      severity: "warning",
      description:
        "İşletmenizdeki bazı ürünlerin fiyatları çok yüksek. Bu durum müşterilerinizi kaçırmanıza neden olabilir. Fiyatlarınızı düzenlemek için ürünler sayfasına gidin.",
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
          <Callout
            key={suggestion.title}
            title={suggestion.title}
            icon={
              suggestion.severity === "warning"
                ? AlertCircle
                : suggestion.severity === "error"
                ? XCircle
                : Info
            }
            color={
              suggestion.severity === "warning"
                ? "orange"
                : suggestion.severity === "error"
                ? "rose"
                : "blue"
            }
          >
            {suggestion.description}
          </Callout>
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
