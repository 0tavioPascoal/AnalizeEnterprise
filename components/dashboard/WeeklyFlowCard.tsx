"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WeeklyFlowCardProps {
  data: number[];
}

interface ChartPoint {
  day: string;
  total: number;
}

const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export function WeeklyFlowCard({ data }: WeeklyFlowCardProps) {
  const chartData: ChartPoint[] = data.map((value, index) => ({
    day: days[index] ?? String(index + 1),
    total: value,
  }));

  return (
    <Card className="flex min-h-0 flex-[0.45] flex-col overflow-hidden border-none bg-white shadow-sm dark:bg-zinc-900">
      <CardHeader className="flex shrink-0 flex-row items-center justify-between border-b border-zinc-50 px-4 py-3 dark:border-zinc-800">
        <div>
          <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            Fluxo Semanal
          </CardTitle>
          <p className="mt-1 text-xs text-zinc-500">
            Análises criadas nos últimos 7 dias
          </p>
        </div>

        <TrendingUp size={16} className="text-indigo-500" />
      </CardHeader>

      <CardContent className="min-h-0 flex-1 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="analysisFlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="#e4e4e7"
            />

            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#a1a1aa" }}
            />

            <Tooltip
              cursor={{ stroke: "#6366f1", strokeWidth: 1 }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e4e4e7",
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                fontSize: 12,
              }}
              formatter={(value) => [`${value} análises`, "Total"]}
              labelFormatter={(label) => `Dia: ${label}`}
            />

            <Area
              type="monotone"
              dataKey="total"
              stroke="#6366f1"
              strokeWidth={3}
              fill="url(#analysisFlow)"
              dot={{
                r: 3,
                strokeWidth: 2,
                fill: "#ffffff",
                stroke: "#6366f1",
              }}
              activeDot={{
                r: 5,
                strokeWidth: 2,
                fill: "#6366f1",
                stroke: "#ffffff",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}