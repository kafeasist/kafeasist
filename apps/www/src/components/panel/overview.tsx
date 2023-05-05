"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
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
      <LineChart data={data}>
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
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="total" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
