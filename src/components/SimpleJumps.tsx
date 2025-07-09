import type { ColumnDef } from "@tanstack/react-table";
import { AwardIcon } from "lucide-react";
import DataTable from "./ui/data-table";

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
            header: () => <div className="text-left">ID Atleta</div>,
        },
        {
            accessorKey: 'Nombre_de_atleta',
            header: () => <div className="text-left">Nombre Atleta</div>,
        },
        {
            accessorKey: 'Id_de_salto',
            header: () => <div className="text-left">ID Salto</div>,
        },
        {
            accessorKey: 'Tipo',
            header: () => <div className="text-left">Tipo</div>,
        },
        {
            accessorKey: 'TC',
            header: () => <div className="text-left">TC</div>,
        },
        {
            accessorKey: 'TV',
            header: () => <div className="text-left">TV</div>,
        },
        {
            accessorKey: 'Caída',
            header: () => <div className="text-left">Caída</div>,
        },
        {
            accessorKey: 'Peso_KG',
            header: () => <div className="text-left">Peso (KG)</div>,
        },
        {
            accessorKey: 'Altura',
            header: () => <div className="text-left">Altura</div>,
        },
        {
            accessorKey: 'Potencia',
            header: () => <div className="text-left">Potencia</div>,
        },
        {
            accessorKey: 'Rigidez',
            header: () => <div className="text-left">Rigidez</div>,
        },
        {
            accessorKey: 'Velocidad_inicial',
            header: () => <div className="text-left">Velocidad Inicial</div>,
        },
        {
            accessorKey: 'RSI',
            header: () => <div className="text-left">RSI</div>,
        },
        {
            accessorKey: 'Fecha_y_hora',
            header: () => <div className="text-left">Fecha y Hora</div>,
        },
        {
            accessorKey: 'Descripción',
            header: () => <div className="text-left">Descripción</div>,
        },
        {
            accessorKey: 'Simulado',
            header: () => <div className="text-left">Simulado</div>,
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
            <DataTable data={saltos} columns={columns} inputPlaceholder="Buscar por ID atleta, nombre, ID salto..." />
        </section>
    )

}

export default SimpleJumps;