"use client";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ChartData {
  week: string;
  products: number;
}

export default function ProductsChart({ data }: { data: ChartData[] }) {
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="week" stroke="#666" fontSize={12} tickLine={false} />
          <YAxis
            stroke="#666"
            fontSize={12}
            tickLine={false}
            allowDecimals={false}
          />
          <Area
            type="monotone"
            dataKey="products"
            stroke="#8884d8"
            fill="#8884d8"
            dot={{ stroke: "#8884d8" }}
            activeDot={{ stroke: "#8884d8" }}
          />

          <Tooltip />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
