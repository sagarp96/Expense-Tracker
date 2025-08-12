import { categories } from "@/lib/Data/Categories_Data";
import { useTransactions } from "@/hooks/GetTransactionDetails";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TrendingUp } from "lucide-react";
import { LabelList, Pie, PieChart } from "recharts";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A pie chart with a label list";

const queryClient = new QueryClient();

export default function TransactionChart() {
  return (
    <QueryClientProvider client={queryClient}>
      <RenderChart />
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  );
}

export function RenderChart() {
  const { data, isPending, error } = useTransactions();

  if (isPending) return "Loading...";
  if (error) return "An error has occurred: " + error.message;

  interface TransactionDataItem {
    name: string;
    amount: number;
    fill: string;
  }
  const chartData: TransactionDataItem[] = [];

  const chartConfig: Record<string, { label: string; color: string }> = {};

  if (data) {
    const getchartData = () => {
      for (let i = 0; i < data.length; i++) {
        chartData.push({
          name: data[i].Name,
          amount: data[i].Amount,
          fill: getcategoryColor(data[i].Category),
        });
      }
      return chartData;
    };

    const chartConfigData = () => {
      for (let i = 0; i < data.length; i++) {
        chartConfig[data[i].Name] = {
          label: data[i].Name,
          color: getcategoryColor(data[i].Category),
        };
      }
      return chartConfig;
    };

    function getcategoryColor(datacategory: string) {
      const categoryIndex = categories.findIndex(
        (category) => datacategory === category.name
      );
      if (categoryIndex !== -1) {
        return categories[categoryIndex].chartColor;
      }
      return "#808080";
    }

    chartConfigData();
    getchartData();

    console.log(chartData);
    console.log(chartConfig, "this is the CONFIGS data");
  }

  console.log(data, "this is the chart data");
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Label List</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="amount" hideLabel />}
            />
            <Pie data={chartData} dataKey="amount">
              <LabelList
                dataKey="name"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: keyof typeof chartConfig) =>
                  chartConfig[value]?.label
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
