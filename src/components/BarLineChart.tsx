import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { Bar, CartesianGrid, ComposedChart, Legend, Line, Tooltip, XAxis, YAxis, type BarProps } from "recharts";
import type { Jump } from "./SimpleJumps";

export const chartColors: Record<string, string> = {
    y: 'rgba(255, 99, 132, 1)',
    y1: 'rgba(54, 162, 235, 1)',
    y2: 'rgba(255, 206, 86, 1)'
}

export const axisIds = ['y', 'y1', 'y2'];

const CustomLabel = (props: any) => {
    const { value, viewBox, position } = props;
    const centerY = viewBox.y + viewBox.height / 2;
    const offset = 36;
    const x = position === "insideLeft"
        ? viewBox.x + offset - 10
        : viewBox.x + viewBox.width + offset * -1 + 15;

    return (
        <text
            x={x}
            y={centerY}
            fill="#333"
            textAnchor="middle"
            fontSize={13}
            fontWeight={500}
            transform={`rotate(-90, ${x}, ${centerY})`}
        >
            {value}
        </text>
    );
};

const BarLineChart = ({ data = [], metrics = [] }: { data: Jump[], metrics: (keyof Jump)[] }) => {
    const grouped: Record<string, any> = {};

    data.forEach(d => {
        if (!grouped[d.Nombre_de_atleta]) grouped[d.Nombre_de_atleta] = { atleta: d.Nombre_de_atleta };
        metrics.forEach(metric => {
            // Si la métrica es string, conviértela a número
            const value = typeof d[metric] === "string"
                ? parseFloat(String(d[metric]).replace(",", "."))
                : d[metric];
            // Aquí puedes decidir si guardar el último, el máximo, el promedio, etc.
            grouped[d.Nombre_de_atleta][metric] = value;
        });
    });

    const rechartsData = Object.values(grouped);
    const chartConfig: Partial<Record<keyof Jump, any>> = {} satisfies ChartConfig

    metrics.forEach(metric => {
        chartConfig[metric] = { [metric]: { label: metric } }
    })

    const barConfig = {
        maxBarSize: 100
    } satisfies Pick<BarProps, 'barSize' | 'maxBarSize'>

    return (
        <ChartContainer config={chartConfig}>
            <ComposedChart data={rechartsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="atleta" axisLine={true} angle={-45} textAnchor="end" height={150} />
                {metrics.map((metric, i) => {
                    const color = chartColors[axisIds[i] ?? 'y'];
                    return (
                        <YAxis
                            key={metric}
                            yAxisId={metric}
                            orientation={i % 2 === 0 ? "left" : "right"}
                            stroke={color}
                            axisLine={{ stroke: color, strokeWidth: 1 }}
                            tickLine={{ stroke: color, strokeWidth: 1 }}
                            tick={{
                                stroke: color,
                                strokeWidth: 1
                            }}
                            label={{
                                value: metric,
                                position: i % 2 === 0 ? "insideLeft" : "insideRight",
                                angle: -90,
                                content: (props: any) => <CustomLabel {...props} position={i % 2 === 0 ? "insideLeft" : "insideRight"} />
                            }}
                        />
                    );
                })}
                <Legend verticalAlign="top" wrapperStyle={{ fontSize: '14px' }} height={36} />
                <Tooltip />
                {/* 2 barras y 1 línea, pero puedes hacerlo dinámico */}
                {metrics.map((metric, i) => {
                    const color = chartColors[axisIds[i] ?? 'y'];
                    const type = i < 2 ? 'bar' : 'line';
                    if (type === 'bar') {
                        return (
                            <Bar
                                key={metric}
                                dataKey={metric}
                                maxBarSize={barConfig.maxBarSize}
                                fill={color}
                                yAxisId={metric}
                            />
                        );
                    }
                    if (type === 'line') {
                        return (
                            <Line
                                key={metric}
                                dataKey={metric}
                                type="linear"
                                strokeWidth={2}
                                dot={{
                                    fill: color,
                                    r: 6
                                }}
                                activeDot={{
                                    r: 8,
                                }}
                                stroke={color}
                                yAxisId={metric}
                            />
                        );
                    }
                    return null;
                })}
            </ComposedChart>
        </ChartContainer>
    );
}

export default BarLineChart
