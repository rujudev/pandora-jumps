import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { Upload } from "lucide-react"
import { useCallback, useRef, useState } from "react"

interface DragDropZoneProps {
    onFileSelected?: (file: File) => void
    acceptedFileTypes?: string[],
    isLoading?: boolean,
    onLoad?: (isLoading: boolean) => void,
    className?: string
}

export function DragDropZone({
    onFileSelected,
    acceptedFileTypes = ["image/*", "application/pdf", ".doc", ".docx", ".csv"],
    onLoad = () => null,
    isLoading = false,
    className,
}: DragDropZoneProps) {
    const [isDragOver, setIsDragOver] = useState(false)
    const [file, setFile] = useState<File>()
    const [progress, setProgress] = useState<number>(0);
    const fileInputRef = useRef<HTMLInputElement>(null)

    const processFile = async (file: FileList) => {
        onLoad(true)

        await simulateUpload()
        setFile(file[0])
        onFileSelected?.(file[0])

        onLoad(false)
        setProgress(0)
    }

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
    }, [])

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            setIsDragOver(false)

            const droppedFiles = e.dataTransfer.files
            if (droppedFiles.length > 0) {
                processFile(droppedFiles)
            }
        },
        [processFile],
    )

    const handleFileSelect = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const selectedFiles = e.target.files
            if (selectedFiles && selectedFiles.length > 0) {
                processFile(selectedFiles)
            }
        },
        [processFile],
    )

    const simulateUpload = async () => {
        // Simular progreso de subida
        for (let i = 0; i <= 100; i += 10) {
            await new Promise((resolve) => setTimeout(resolve, 200))
            setProgress(i)
        }
    }

    return (
        <div className={cn("w-full max-w-2xl mx-auto", className)}>
            {/* Zona de Drop */}
            <Card
                className={cn(
                    "border-2 border-dashed transition-all duration-200 cursor-pointer py-0",
                    isDragOver ? "border-primary bg-primary/5 scale-105" : "border-muted-foreground/25 hover:border-primary/50",
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
                    <div
                        className={cn(
                            "rounded-full p-4 mb-4 transition-colors",
                            isDragOver ? "bg-primary text-primary-foreground" : "bg-muted",
                        )}
                    >
                        <Upload className="h-8 w-8" />
                    </div>

                    <h3 className="text-lg font-semibold mb-2">
                        {isDragOver ? "¡Suelta los archivos aquí!" : "Arrastra y suelta tus archivos"}
                    </h3>

                    <p className="text-muted-foreground mb-4">
                        o <span className="text-primary font-medium">haz clic para seleccionar</span>
                    </p>

                    <div className="flex flex-wrap gap-2 justify-center text-xs text-muted-foreground">
                        <Badge variant="secondary">Máximo 1 archivo</Badge>
                    </div>

                    <p className="text-xs text-muted-foreground mt-2">Formatos soportados: {acceptedFileTypes.join(", ")}</p>

                    {isLoading && <Progress value={progress} className="my-4" />}
                    {file && progress === 0 && !isLoading && (
                        <div className="flex items-center justify-center py-4">
                            <h4 className="font-semibold">Archivo seleccionado: {file.name}</h4>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Input oculto */}
            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={acceptedFileTypes.join(",")}
                onChange={handleFileSelect}
                className="hidden"
            />
        </div>
    )
}
