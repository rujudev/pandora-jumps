import type { ColumnDef } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import {
    type ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination"
import { SearchIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Input } from './input'

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[],
    data: TData[],
    inputPlaceholder?: string
}

function DataTable<TData, TValue>({
    data,
    columns,
    inputPlaceholder
}: DataTableProps<TData, TValue>) {
    const [paginationState, setPaginationState] = useState({
        pageIndex: 0,
        pageSize: 10,
    })
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange: setPaginationState,
        state: {
            pagination: paginationState,
            columnFilters
        }
    })

    const pageCount = table.getPageCount();
    const pageIndex = table.getState().pagination.pageIndex;

    const visiblePages = useMemo(() => {
        const total = pageCount;
        const currentPage = pageIndex;
        const pagesToShowLeftRight = 3;
        const pages: number[] = []

        if (total === 0) return pages;

        const pageStart = Math.max(1, currentPage + 1 - pagesToShowLeftRight);
        const pageEnd = Math.min(total, currentPage + 1 + pagesToShowLeftRight);

        for (let i = pageStart; i <= pageEnd; i++) {
            pages.push(i)
        }

        return pages.slice(0, pagesToShowLeftRight + 1);
    }, [pageCount, pageIndex])


    return (
        <div>
            <header className="flex items-center justify-between w-full py-4">
                <div className="flex items-center relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder={inputPlaceholder ? inputPlaceholder : 'Buscar atleta...'}
                        onChange={(event) =>
                            table.setGlobalFilter(event.target.value)
                        }
                        className="pl-10 w-full"
                    />
                </div>
                {Object.values(data).every(d => Object.keys(d).includes('Tipo')) && (
                    <div className="">
                        <Select onValueChange={(value) => table.setColumnFilters([{ id: 'Tipo', value }])}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filtrar por salto" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {Array.from(new Set(data.map(d => d.Tipo))).map((tipo, index) => (
                                        <SelectItem key={index} value={tipo}>
                                            {tipo}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </header>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <div className="flex max-md:flex-wrap items-center justify-between mt-4 w-full">
                    <div className="flex max-md:justify-center items-center gap-4 w-full py-2 has-[>svg]:px-3 px-2.5 sm:pl-2.5">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Mostrar:</span>
                            <Select
                                value={paginationState.pageSize.toString()}
                                onValueChange={(value) => setPaginationState(prev => ({ ...prev, pageSize: Number(value) }))}
                            >
                                <SelectTrigger className="w-20">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5</SelectItem>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="20">20</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                </SelectContent>
                            </Select>
                            <span className="text-sm text-muted-foreground">por página</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Mostrando {paginationState.pageIndex + 1} a {paginationState.pageSize} de {data.length}{" "}
                            resultados
                        </p>
                    </div>
                    <Pagination className="max-md:p-4 max-md:justify-center justify-end">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() =>
                                        setPaginationState(prev => ({
                                            ...prev,
                                            pageIndex: Math.max(prev.pageIndex - 1, 0),
                                        }))
                                    }
                                    disabled={!table.getCanPreviousPage()}
                                />
                            </PaginationItem>

                            {visiblePages.map(page => (
                                <PaginationItem key={page}>
                                    <Button
                                        variant={page - 1 === pageIndex ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => table.setPageIndex(page - 1)}
                                    >
                                        {page}
                                    </Button>
                                </PaginationItem>
                            ))}

                            {visiblePages.length > 0 && visiblePages[visiblePages.length - 1] < pageCount && (
                                <>
                                    {visiblePages[visiblePages.length - 1] < pageCount - 1 && (
                                        <PaginationItem>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    )}
                                    <PaginationItem>
                                        <Button variant="ghost" size="sm" onClick={() => table.setPageIndex(pageCount - 1)}>
                                            {pageCount}
                                        </Button>
                                    </PaginationItem>
                                </>
                            )}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() =>
                                        setPaginationState(prev => ({
                                            ...prev,
                                            pageIndex: Math.max(prev.pageIndex + 1, 0),
                                        }))
                                    }
                                    disabled={!table.getCanNextPage()}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    )
}

export default DataTable