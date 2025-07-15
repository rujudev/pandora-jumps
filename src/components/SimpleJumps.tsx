import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, AwardIcon, StretchHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";

export type Jump = {
    Id_de_atleta: number,
    Nombre_de_atleta: string,
    Id_de_salto: number,
    Tipo: string,
    TC: string,
    TV: string,
    Caída: string,
    Peso_KG: number,
    Altura: string,
    Potencia: number,
    Rigidez: number,
    Velocidad_inicial: number,
    RSI: number,
    Fecha_y_hora: string,
    Descripción: string,
    Simulado: string
}

const SimpleJumps = ({ saltos = [] }: { saltos: Jump[] }) => {
    const athleteData = new Map<number, { name: string, cmj: number[], sj: number[] }>();

    saltos.forEach(salto => {
        if (!athleteData.has(salto.Id_de_atleta)) {
            athleteData.set(salto.Id_de_atleta, {
                name: salto.Nombre_de_atleta,
                cmj: [],
                sj: []
            });
        }

        const athlete = athleteData.get(salto.Id_de_atleta)!;

        if (salto.Tipo.toLowerCase() === 'cmj') {
            athlete.cmj.push(parseFloat(salto.Altura.replace(',', '.')));
        } else if (salto.Tipo.toLowerCase() === 'sj') {
            athlete.sj.push(parseFloat(salto.Altura.replace(',', '.')));
        }
    })

    // Calcular índice elástico por atleta
    const elasticIndexResults: Array<{
        idAtleta: number
        nombreAtleta: string
        avgCMJ: number | null
        avgSJ: number | null
        elasticIndex: number | null
        cmjCount: number
        sjCount: number
    }> = []

    athleteData.forEach((data, idAtleta) => {
        let totalCMJ = 0;
        let totalSJ = 0;
        let avgCMJ: number = 0;
        let avgSJ: number = 0;

        for (const cmjJump of data.cmj) {
            totalCMJ += cmjJump;
        }

        console.log('Atleta: ', data.name, 'Total CMJ:', totalCMJ, 'Count:', data.cmj.length);
        console.log('Atleta: ', data.name, 'Total SJ:', totalSJ, 'Count:', data.sj.length);

        avgCMJ /= data.cmj.length;

        for (const sjJump of data.sj) {
            totalSJ += sjJump;
        }

        avgSJ /= data.sj.length;

        const elasticIndex = (totalCMJ - totalSJ) * 100 / totalSJ;

        elasticIndexResults.push({
            idAtleta,
            nombreAtleta: data.name,
            avgCMJ: totalCMJ > 0 ? totalCMJ / data.cmj.length : null,
            avgSJ: data.sj.length > 0 ? totalSJ / data.sj.length : null,
            elasticIndex,
            cmjCount: data.cmj.length,
            sjCount: data.sj.length
        })
    })

    const columns: ColumnDef<Jump>[] = [
        {
            accessorKey: 'Id_de_atleta',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        ID Atleta
                        <ArrowUpDown />
                    </Button>
                )
            },
            enableSorting: true
        },
        {
            accessorKey: 'Nombre_de_atleta',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Nombre Atleta
                        <ArrowUpDown />
                    </Button>
                )
            },
            enableSorting: true
        },
        {
            accessorKey: 'Id_de_salto',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        ID Salto
                        <ArrowUpDown />
                    </Button>
                )
            },
            enableSorting: true
        },
        {
            accessorKey: 'Tipo',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Tipo
                        <ArrowUpDown />
                    </Button>
                )
            },
            enableSorting: true
        },
        {
            accessorKey: 'TC',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        TC
                        <ArrowUpDown />
                    </Button>
                )
            },
            enableSorting: true
        },
        {
            accessorKey: 'TC',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        TC
                        <ArrowUpDown />
                    </Button>
                )
            },
            enableSorting: true
        },
        {
            accessorKey: 'TV',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        TV
                        <ArrowUpDown />
                    </Button>
                )
            },
            enableSorting: true
        },
        {
            accessorKey: 'Caída',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Caída
                        <ArrowUpDown />
                    </Button>
                )
            },
            enableSorting: true
        },
        {
            accessorKey: 'Peso_KG',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Peso (KG)
                        <ArrowUpDown />
                    </Button>
                )
            },
            enableSorting: true
        },
        {
            accessorKey: 'Altura',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Altura
                        <ArrowUpDown />
                    </Button>
                )
            },
            enableSorting: true
        },
        {
            accessorKey: 'Potencia',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Potencia
                        <ArrowUpDown />
                    </Button>
                )
            },
            enableSorting: true
        },
        {
            accessorKey: 'Rigidez',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Rigidez
                        <ArrowUpDown />
                    </Button>
                )
            },
            enableSorting: true
        },
        {
            accessorKey: 'Velocidad_inicial',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Velocidad Inicial
                        <ArrowUpDown />
                    </Button>
                )
            },
            enableSorting: true
        },
        {
            accessorKey: 'RSI',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        RSI
                        <ArrowUpDown />
                    </Button>
                )
            },
            enableSorting: true
        },
        {
            accessorKey: 'Fecha_y_hora',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Fecha y Hora
                        <ArrowUpDown />
                    </Button>
                )
            },
            enableSorting: true
        },
        {
            accessorKey: 'Descripción',
            header: ({ column }) => {
                console.log(column);
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Descripción
                        <ArrowUpDown />
                    </Button>
                )
            },
            enableSorting: true
        },
        {
            accessorKey: 'Simulado',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Simulado
                        <ArrowUpDown />
                    </Button>
                )
            },
            enableSorting: true
        },
    ];

    return (
        <section className="p-5 mb-5 border-1 border-neutral-200 rounded-md">
            <header className="flex flex-col gap-5">
                <div className='flex gap-3 items-center'>
                    <AwardIcon />
                    <h2 className="font-bold text-2xl">Registro de saltos</h2>
                </div>
            </header>
            <div className="flex flex-col gap-5 mt-5">
                <DataTable
                    data={saltos}
                    columns={columns}
                    inputPlaceholder="Buscar por ID atleta, nombre, ID salto..."
                />
                {elasticIndexResults.length > 0 && (
                    <div className="flex flex-col gap-5 mt-4">
                        <header className="flex flex-col gap-5">
                            <div className='flex gap-3 items-center'>
                                <StretchHorizontal />
                                <h2 className="font-bold text-2xl">Índices elásticos</h2>
                            </div>
                        </header>
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
                            {elasticIndexResults.map(result => (
                                <Card key={result.idAtleta} className="p-4 gap-2">
                                    <CardHeader>
                                        <h3 className="font-bold">{result.nombreAtleta}</h3>
                                        <span className="text-sm text-gray-500">ID: {result.idAtleta}</span>
                                    </CardHeader>
                                    <CardContent className="flex flex-col gap-3">
                                        <div className="flex items-center justify-center">
                                            <span className={`text-4xl font-bold ${result.elasticIndex! >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {result.elasticIndex?.toFixed(2)}%
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-sm text-gray-500">CMJ promedio:</span>
                                                <span className="text-sm text-gray-500">{result.avgCMJ?.toFixed(2) ?? 'N/A'} cm</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-sm text-gray-500">SJ promedio:</span>
                                                <span className="text-sm text-gray-500">{result.avgSJ?.toFixed(2) ?? 'N/A'} cm</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-sm text-gray-500">Saltos realizados:</span>
                                                <span className="text-sm text-gray-500">{result.cmjCount} CMJ, {result.sjCount} SJ</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    )

}

export default SimpleJumps;