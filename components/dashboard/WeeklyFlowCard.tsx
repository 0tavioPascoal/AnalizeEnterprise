"use client";

import { useId, useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface WeeklyFlowCardProps {
  data: number[];
}

interface ChartPoint {
  day: string;
  total: number;
}

const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export function WeeklyFlowCard({ data }: WeeklyFlowCardProps) {
  const gradientId = useId();

  const chartData = useMemo<ChartPoint[]>(() => {
    return days.map((day, index) => ({
      day,
      total: Number(data[index] ?? 0),
    }));
  }, [data]);

  const total = useMemo(() => {
    return chartData.reduce((acc, item) => acc + item.total, 0);
  }, [chartData]);

  const hasData = total > 0;

  return (
    <Card className="flex min-h-0 flex-[0.45] flex-col overflow-hidden border border-border bg-card shadow-sm">
      <CardHeader className="flex shrink-0 flex-row items-center justify-between border-b border-border px-5 py-4">
        <div>
          <CardTitle className="text-sm font-extrabold uppercase tracking-wide text-muted-foreground">
            Fluxo Semanal
          </CardTitle>

          <p className="mt-1 text-sm text-muted-foreground">
            {total} análises nos últimos 7 dias
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
          <TrendingUp size={20} />
        </div>
      </CardHeader>

      <CardContent className="min-h-0 flex-1 p-5">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="currentColor"
                className="text-border"
              />

              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                tick={{
                  fontSize: 12,
                  fontWeight: 600,
                  fill: "currentColor",
                }}
                className="text-muted-foreground"
              />

              <Tooltip
                cursor={{
                  stroke: "#6366f1",
                  strokeWidth: 1,
                }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid hsl(var(--border))",
                  background: "hsl(var(--card))",
                  color: "hsl(var(--foreground))",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  fontSize: 13,
                  fontWeight: 600,
                }}
                formatter={(value) => [`${Number(value)} análises`, "Total"]}
                labelFormatter={(label) => `Dia: ${label}`}
              />

              <Area
                type="monotone"
                dataKey="total"
                stroke="#6366f1"
                strokeWidth={3}
                fill={`url(#${gradientId})`}
                dot={{
                  r: 4,
                  strokeWidth: 2,
                  fill: "hsl(var(--card))",
                  stroke: "#6366f1",
                }}
                activeDot={{
                  r: 6,
                  strokeWidth: 2,
                  fill: "#6366f1",
                  stroke: "hsl(var(--card))",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full min-h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 px-6 text-center">
            <p className="text-base font-bold text-foreground">
              Sem análises nesta semana
            </p>

            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              O fluxo será exibido conforme novas análises forem criadas.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}