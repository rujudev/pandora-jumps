import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, AwardIcon } from "lucide-react";

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
        <section className="p-5 border-1 border-neutral-200 rounded-md">
            <header className="flex flex-col gap-5">
                <div className='flex gap-3 items-center'>
                    <AwardIcon />
                    <h2 className="font-bold text-2xl">Registro de saltos</h2>
                </div>
            </header>
            <DataTable
                data={saltos}
                columns={columns}
                inputPlaceholder="Buscar por ID atleta, nombre, ID salto..."
            />
        </section>
    )

}

export default SimpleJumps;