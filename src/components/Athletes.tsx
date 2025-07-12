import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, DumbbellIcon } from "lucide-react";

type Athlete = {
    Id: number,
    Nombre: string,
    Sexo: string,
    Fecha_Nacimiento: string,
    Altura: number,
    Peso: number,
    Deporte: string,
    Especialidad: string,
    Nivel: string
}

const Athletes = ({ atletas = [] }: { atletas: Athlete[] }) => {
    const columns: ColumnDef<Athlete>[] = [
        {
            accessorKey: 'Id',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Id
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => (
                <span>
                    {row.getValue('Id') ?? '-'}
                </span>
            )
        },
        {
            accessorKey: 'Nombre',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Nombre
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => (
                <span>
                    {row.getValue('Nombre') ?? '-'}
                </span>
            )
        },
        {
            accessorKey: 'Sexo',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Sexo
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => (
                <Badge variant="outline">
                    {row.getValue('Sexo') ?? '-'}
                </Badge>
            )
        },
        {
            accessorKey: 'Fecha_Nacimiento',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Fecha nacimiento
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => (
                <span>
                    {row.getValue('Fecha_Nacimiento') ?? '-'}
                </span>
            )
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
            cell: ({ row }) => (
                <span>
                    {row.getValue('Altura') ?? '-'}
                </span>
            )
        },
        {
            accessorKey: 'Peso',
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
            cell: ({ row }) => (
                <span>
                    {row.getValue('Peso') ?? '-'}
                </span>
            )
        },
        {
            accessorKey: 'Deporte',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Deporte
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => (
                <span>
                    {row.getValue('Deporte') ?? '-'}
                </span>
            )
        },
        {
            accessorKey: 'Especialidad',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Especialidad
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => (
                <span>
                    {row.getValue('Especialidad') ?? '-'}
                </span>
            )
        },
        {
            accessorKey: 'Nivel',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Nivel
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => (
                <Badge variant="outline">
                    {row.getValue('Nivel') ?? '-'}
                </Badge>
            )
        },
    ];

    return (
        <section className="p-5 border-1 border-neutral-200 rounded-md">
            <header className="flex flex-col gap-5">
                <div className='flex gap-3 items-center'>
                    <DumbbellIcon />
                    <h2 className="font-bold text-2xl">Atletas Cargados</h2>
                </div>
            </header>
            <DataTable data={atletas} columns={columns} />
        </section>
    )
}

export default Athletes;