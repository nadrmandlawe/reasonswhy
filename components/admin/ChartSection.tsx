import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export interface ChartSectionProps {
  topLocations: Array<{ name: string; value: number }>;
}

export default function ChartSection({ topLocations }: ChartSectionProps) {
  return (
    <Card className="p-6">
      <h2 className="flex items-center gap-2 mb-4 font-semibold">
        <MapPin className="w-4 h-4" />
        Top Locations
      </h2>
      <div className="h-[300px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={topLocations}
            margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
            className="[&_.recharts-cartesian-grid-horizontal_line]:stroke-border [&_.recharts-cartesian-grid-vertical_line]:stroke-border"
          >
            <XAxis 
              dataKey="name" 
              tick={{ fill: "hsl(var(--foreground))" }}
              interval={0}
              axisLine={{ stroke: "hsl(var(--border))" }}
              tickLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis 
              tick={{ fill: "hsl(var(--foreground))" }}
              width={30}
              axisLine={{ stroke: "hsl(var(--border))" }}
              tickLine={{ stroke: "hsl(var(--border))" }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: '6px',
                color: "hsl(var(--foreground))",
                padding: "8px 12px"
              }}
              cursor={{ 
                fill: "hsl(var(--muted))",
                opacity: 0.2
              }}
              labelStyle={{ 
                color: "hsl(var(--foreground))",
                fontWeight: 500,
                marginBottom: "4px"
              }}
              itemStyle={{ 
                color: "hsl(var(--foreground))",
                padding: "2px 0"
              }}
            />
            <Bar 
              dataKey="value" 
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
              name="Reasons"
              maxBarSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
} 