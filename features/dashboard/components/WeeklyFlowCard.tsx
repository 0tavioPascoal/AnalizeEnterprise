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
    <Card className="flex min-h-64 flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/85 py-0 shadow-sm transition-all duration-300 hover:border-primary/20 hover:bg-card hover:shadow-md xl:min-h-0 xl:flex-[0.48]">
      <CardHeader className="flex shrink-0 flex-row items-center justify-between border-b border-border/40 bg-muted/10 px-4 py-3 md:px-5">
        <div>
          <CardTitle className="text-xs font-extrabold uppercase tracking-[0.12em] text-muted-foreground">
            Fluxo Semanal
          </CardTitle>

          <p className="mt-1 text-sm font-medium text-foreground">
            {total} análises nos últimos 7 dias
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/15 bg-primary/10 text-primary">
          <TrendingUp size={18} />
        </div>
      </CardHeader>

      <CardContent className="min-h-0 flex-1 p-4 md:p-5">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.02} />
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
                  stroke: "var(--primary)",
                  strokeWidth: 1,
                }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  background: "var(--card)",
                  color: "var(--card-foreground)",
                  boxShadow: "0 12px 28px color-mix(in oklch, var(--foreground) 12%, transparent)",
                  fontSize: 13,
                  fontWeight: 600,
                }}
                formatter={(value) => [`${Number(value)} análises`, "Total"]}
                labelFormatter={(label) => `Dia: ${label}`}
              />

              <Area
                type="monotone"
                dataKey="total"
                stroke="var(--primary)"
                strokeWidth={3}
                fill={`url(#${gradientId})`}
                dot={{
                  r: 4,
                  strokeWidth: 2,
                  fill: "var(--card)",
                  stroke: "var(--primary)",
                }}
                activeDot={{
                  r: 6,
                  strokeWidth: 2,
                  fill: "var(--primary)",
                  stroke: "var(--card)",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full min-h-36 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 px-5 text-center">
            <p className="text-sm font-bold text-foreground">
              Sem análises nesta semana
            </p>

            <p className="mt-1 max-w-sm text-sm leading-relaxed text-muted-foreground">
              O fluxo será exibido conforme novas análises forem criadas.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
