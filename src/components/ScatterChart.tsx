"use client"

import {
    CartesianGrid,
    ComposedChart,
    Legend,
    Line,
    ResponsiveContainer,
    Scatter,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"
import { chartColors } from "./BarLineChart"
import type { Jump } from "./SimpleJumps"

interface ScatterTrendlineChartProps {
    data: Jump[]
    metric: keyof Jump
}

// Función para normalizar valores (convertir comas a puntos y a número)
function normalizeValue(value: any): number {
    if (typeof value === "number") return value
    if (typeof value === "string") {
        const normalized = value.replace(",", ".")
        const parsed = Number.parseFloat(normalized)
        return isNaN(parsed) ? 0 : parsed
    }
    return 0
}

// Función para calcular la regresión lineal usando Id_de_atleta como X
function calculateTrendline(data: any[], yKey: string) {
    const validData = data.filter((item) => {
        const x = item.Id_de_atleta
        const y = normalizeValue(item[yKey])
        return !isNaN(x) && !isNaN(y) && y !== 0
    })

    if (validData.length < 2) return { processedData: data, trendlineData: [] }

    const n = validData.length
    const sumX = validData.reduce((sum, item) => sum + item.Id_de_atleta, 0)
    const sumY = validData.reduce((sum, item) => sum + normalizeValue(item[yKey]), 0)
    const sumXY = validData.reduce((sum, item) => sum + item.Id_de_atleta * normalizeValue(item[yKey]), 0)
    const sumXX = validData.reduce((sum, item) => sum + Math.pow(item.Id_de_atleta, 2), 0)

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
    const intercept = (sumY - slope * sumX) / n

    // Crear datos específicos para la línea de tendencia
    // Solo IDs únicos, ordenados, sin gaps

    const processedData = data.map((item) => ({
        ...item,
        [yKey + "_normalized"]: normalizeValue(item[yKey]),
        slope,
        intercept,
        trendline: slope * item.Id_de_atleta + intercept
    })).sort((a, b) => a.Id_de_atleta - b.Id_de_atleta)

    const trendlineData = processedData.map((item) => ({
        Id_de_atleta: item.Id_de_atleta,
        trendline: slope * item.Id_de_atleta + intercept,
    }))

    const uniqueIds = processedData.map((p) => p.Id_de_atleta)
    const minTrendline = slope * Math.min(...uniqueIds) + intercept
    const maxTrendline = slope * Math.max(...uniqueIds) + intercept

    return { processedData, trendlineData, minTrendline, maxTrendline }

}

const CustomTooltip = ({ active, payload, label, ...restOfProps }: any) => {
    if (active && payload && payload.length > 0) {
        // Buscar el payload del scatter (no de la línea de tendencia)
        const scatterPayload = payload.find((p: any) => p.dataKey && p.dataKey.includes("_normalized"))

        if (!scatterPayload) return null

        const data = scatterPayload.payload
        const yKey = scatterPayload.dataKey.replace("_normalized", "")

        const athleteKeyData = restOfProps.processedData.filter(
            pData => pData.Id_de_atleta === data.Id_de_atleta
        )
            .map(d => ({
                ...d,
                idSalto: d.Id_de_salto,
                [yKey]: normalizeValue(d[yKey]).toFixed(3),
                trendline: normalizeValue(d.trendline).toFixed(3)
            }))

        return (
            <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg max-w-sm z-[1000]">
                <div className="flex flex-col items-center justify-center border-dashed border-b border-gray-200 pb-2 mb-2">
                    <p className={`font-bold text-lg ${chartColors['y']}`}>{data.Nombre_de_atleta}</p>
                    <p className="font-bold text-sm text-gray-600">
                        ID: {data.Id_de_atleta}
                    </p>
                    <p className="text-sm text-amber">
                        Tendencia: {data.trendline.toFixed(3)}
                    </p>
                </div>

                <div className="space-y-2 [&>div]:not-last:border-b-1 [&>div]:not-last:border-gray-300 z-1">
                    {athleteKeyData.map(athleteData => (
                        <div className="flex flex-col gap-2 pb-2">
                            <div className="flex justify-between gap-1">
                                <span className="font-bold">ID Salto:</span>
                                <span className="font-medium">{athleteData.idSalto}</span>
                            </div>
                            <div className="flex justify-between gap-1">
                                <span className="font-bold text-sky">{yKey}:</span>
                                <span className="font-medium">{parseFloat(athleteData[yKey]).toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
    return null
}

export default function ScatterTrendlineChart({ data, metric }: ScatterTrendlineChartProps) {
    const { processedData, trendlineData, minTrendline, maxTrendline } = calculateTrendline(data, metric)

    // Calcular estadísticas de la tendencia
    const validData = processedData.filter((item) => {
        const x = item.Id_de_atleta
        const y = normalizeValue(item[metric])
        return !isNaN(x) && !isNaN(y) && y !== 0
    })

    const correlation = validData.length > 1 ? calculateCorrelation(validData, metric) : 0
    const trendInfo =
        validData.length > 0
            ? {
                slope: validData[0].slope || 0,
                intercept: validData[0].intercept || 0,
            }
            : { slope: 0, intercept: 0 }

    return (
        <div className="w-full p-4">
            <h2 className="text-2xl font-bold mb-4 text-center">Análisis de Rendimiento por Atleta</h2>
            <h2 className="text-xl font-bold mb-4 text-center">{metric}</h2>

            <div className="h-96 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                        data={processedData}
                        margin={{
                            top: 20,
                            right: 30,
                            bottom: 20,
                            left: 20,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="Id_de_atleta"
                            type="number"
                            domain={["dataMin", "dataMax"]}
                            ticks={Array.from(new Set(data.map((d) => d.Id_de_atleta).sort((a, b) => a - b)))}
                        />
                        <YAxis
                            domain={[
                                (dataMin) => {
                                    const minWithTrend = Math.min(dataMin, minTrendline || dataMin)
                                    return minWithTrend - Math.abs(minWithTrend * 1) // 50% margen inferior
                                },
                                (dataMax) => {
                                    const maxWithTrend = Math.max(dataMax, maxTrendline || dataMax)
                                    return maxWithTrend + Math.abs(maxWithTrend * 0.7) // 50% margen superior
                                },
                            ]}
                            tickFormatter={(value) => value.toFixed(2)}

                        />
                        <Tooltip
                            content={<CustomTooltip processedData={processedData} />}
                            cursor={{ strokeDasharray: "3 3" }}
                        />
                        <Legend />

                        {/* Scatter plot para los puntos de datos */}
                        <Scatter
                            dataKey={metric + "_normalized"}
                            fill={chartColors[`y1`]}
                            name={`${metric} por Salto`}
                            r={8}
                            fillOpacity={0.8}
                            stroke={chartColors[`y1`]}
                            strokeWidth={2}
                        />

                        {/* Línea de tendencia */}
                        <Line
                            data={trendlineData}
                            type="linear"
                            dataKey="trendline"
                            stroke={chartColors[`y`]}
                            strokeWidth={1.5}
                            dot={false}
                            name="Línea de Tendencia"
                            connectNulls={false}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            {/* Información estadística */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Estadísticas de {metric}:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                        <span className="font-medium">Puntos de datos:</span> {validData.length}
                    </div>
                    <div>
                        <span className="font-medium">Correlación (r):</span> {correlation.toFixed(3)}
                    </div>
                    <div>
                        <span className="font-medium">Atletas únicos:</span> {new Set(data.map((d) => d.Id_de_atleta)).size}
                    </div>
                    <div>
                        <span className="font-medium">Pendiente:</span> {trendInfo.slope.toFixed(4)}
                    </div>
                </div>

                <div className="mt-3 p-3 bg-white rounded border">
                    <p className="text-sm">
                        <strong>Ecuación de la línea:</strong> y = {trendInfo.slope.toFixed(4)}x + {trendInfo.intercept.toFixed(4)}
                    </p>
                </div>

                <p className="text-xs text-gray-600 mt-2">
                    <strong>Interpretación:</strong> El gráfico muestra la relación entre el ID del atleta y {metric}.
                    {Math.abs(correlation) > 0.7 && (
                        <span className="text-green-600">
                            {" "}
                            Se observa una correlación {correlation > 0 ? "positiva" : "negativa"} fuerte.
                        </span>
                    )}
                    {Math.abs(correlation) < 0.3 && (
                        <span className="text-orange-600"> La correlación es débil, indicando poca relación lineal.</span>
                    )}
                    {trendInfo.slope > 0 && (
                        <span className="text-blue-600"> La tendencia es ascendente: a mayor ID de atleta, mayor {metric}.</span>
                    )}
                    {trendInfo.slope < 0 && (
                        <span className="text-red-600"> La tendencia es descendente: a mayor ID de atleta, menor {metric}.</span>
                    )}
                </p>
            </div>
        </div>
    )
}

// Función para calcular correlación entre Id_de_atleta y la métrica Y
function calculateCorrelation(data: any[], yKey: string): number {
    const n = data.length
    if (n < 2) return 0

    const xValues = data.map((item) => item.Id_de_atleta)
    const yValues = data.map((item) => normalizeValue(item[yKey]))

    const sumX = xValues.reduce((a, b) => a + b, 0)
    const sumY = yValues.reduce((a, b) => a + b, 0)
    const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0)
    const sumXX = xValues.reduce((sum, x) => sum + x * x, 0)
    const sumYY = yValues.reduce((sum, y) => sum + y * y, 0)

    const numerator = n * sumXY - sumX * sumY
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY))

    return denominator === 0 ? 0 : numerator / denominator
}
