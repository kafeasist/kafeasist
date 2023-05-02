"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  {
    name: "Oca",
    total: Math.floor(Math.random() * 5000) + 10000,
  },
  {
    name: "Şub",
    total: Math.floor(Math.random() * 5000) + 10000,
  },
  {
    name: "Mar",
    total: Math.floor(Math.random() * 5000) + 10000,
  },
  {
    name: "Nis",
    total: Math.floor(Math.random() * 5000) + 10000,
  },
  {
    name: "May",
    total: Math.floor(Math.random() * 5000) + 10000,
  },
  {
    name: "Haz",
    total: Math.floor(Math.random() * 5000) + 10000,
  },
  {
    name: "Tem",
    total: Math.floor(Math.random() * 5000) + 10000,
  },
  {
    name: "Ağu",
    total: Math.floor(Math.random() * 5000) + 10000,
  },
  {
    name: "Eyl",
    total: Math.floor(Math.random() * 5000) + 10000,
  },
  {
    name: "Eki",
    total: Math.floor(Math.random() * 5000) + 10000,
  },
  {
    name: "Kas",
    total: Math.floor(Math.random() * 5000) + 10000,
  },
  {
    name: "Ara",
    total: Math.floor(Math.random() * 5000) + 10000,
  },
];

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <Tooltip
          isAnimationActive={false}
          cursor={{
            fill: "transparent",
          }}
          content={({ active, payload, label }) =>
            active && (
              <div className="rounded-md bg-white p-2">
                <p className="font-semibold text-gray-800">
                  {label} ayı satışları
                </p>
                <p className="text-gray-600">
                  ₺{payload && payload[0] && payload[0].value?.toLocaleString()}
                </p>
              </div>
            )
          }
        />
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₺${value}`}
        />
        <Bar dataKey="total" fill="#000C7A" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
