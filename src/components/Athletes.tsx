import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import { DumbbellIcon } from "lucide-react";
import DataTable from "./ui/data-table";

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
            header: () => <div className="text-left">Id</div>,
            cell: ({ row }) => (
                <span>
                    {row.getValue('Id') ?? '-'}
                </span>
            )
        },
        {
            accessorKey: 'Nombre',
            header: () => <div className="text-left">Nombre</div>,
            cell: ({ row }) => (
                <span>
                    {row.getValue('Nombre') ?? '-'}
                </span>
            )
        },
        {
            accessorKey: 'Sexo',
            header: () => <div className="text-left">Sexo</div>,
            cell: ({ row }) => (
                <Badge variant="outline">
                    {row.getValue('Sexo') ?? '-'}
                </Badge>
            )
        },
        {
            accessorKey: 'Fecha_Nacimiento',
            header: () => <div className="text-left">Fecha nacimiento</div>,
            cell: ({ row }) => (
                <span>
                    {row.getValue('Fecha_Nacimiento') ?? '-'}
                </span>
            )
        },
        {
            accessorKey: 'Altura',
            header: () => <div className="text-left">Altura</div>,
            cell: ({ row }) => (
                <span>
                    {row.getValue('Altura') ?? '-'}
                </span>
            )
        },
        {
            accessorKey: 'Peso',
            header: () => <div className="text-left">Peso</div>,
            cell: ({ row }) => (
                <span>
                    {row.getValue('Peso') ?? '-'}
                </span>
            )
        },
        {
            accessorKey: 'Deporte',
            header: () => <div className="text-left">Deporte</div>,
            cell: ({ row }) => (
                <span>
                    {row.getValue('Deporte') ?? '-'}
                </span>
            )
        },
        {
            accessorKey: 'Especialidad',
            header: () => <div className="text-left">Especialidad</div>,
            cell: ({ row }) => (
                <span>
                    {row.getValue('Especialidad') ?? '-'}
                </span>
            )
        },
        {
            accessorKey: 'Nivel',
            header: () => <div className="text-left">Nivel</div>,
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