import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip
} from 'chart.js';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import Loader from '@/components/ui/Loader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Legend,
  Tooltip
);

import Athletes from "@/components/Athletes";
import BarLineChart from '@/components/BarLineChart';
import ScatterChart from '@/components/ScatterChart';
import SimpleJumps, { type Jump } from '@/components/SimpleJumps';
import { Activity, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import './App.css';
import { DragDropZone } from './components/DragDropZone';
import SessionInfo from './components/SessionInfo';
import { getFileData } from './utils/section';

export type SectionName = 'sesion' | 'atletas' | 'saltos';

function App() {
  const [sections, setSections] = useState<Record<SectionName, any[]> | null>(null);
  const [metrics, setMetrics] = useState<{ value: string, label: string }[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [typeJumpGroups, setTypeJumpGroups] = useState<Record<string, any[]>>({ any: [] })
  const [selectedJumpType, setSelectedJumpType] = useState<{ value: string, label: string }>({ value: '', label: '' })
  const [selectedChartType, setSelectedChartType] = useState<{ value: string, label: string }>({ value: '', label: '' });
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([])
  const [selectedAthletes, setSelectedAthletes] = useState<number[]>([])
  const [fileSelected, setFileSelected] = useState<File>()

  const chartTypes = [
    { value: "combined", label: "Combinado Barras y líneas", icon: Activity },
    { value: "scatter", label: "Dispersión", icon: TrendingUp },
  ]

  const getDataFromFile = async (file: File) => {
    const buffer = await file.arrayBuffer();
    let { sesion, atletas, saltos } = await getFileData(buffer);
    const metricsToOmit = new Set(['Id_de_atleta', 'Nombre_de_atleta', 'Id_de_salto', 'Tipo', 'Fecha_y_hora', 'Peso_KG', 'Simulado', 'Descripción']);
    const allMetrics = new Set(Object.keys(saltos[0]));
    const validMetrics = Array.from(allMetrics.symmetricDifference(metricsToOmit))
      .map(metric => ({ value: metric, label: metric.replace(/_/g, ' ') }));

    setMetrics(Array.from(validMetrics));

    const atletaMap = new Map(
      saltos.map(salto => [salto.Nombre_de_atleta, salto.Id_de_atleta])
    );

    atletas = atletas.map(athlete => ({
      ...athlete,
      Id: atletaMap.get(athlete.Nombre) || ''
    }))

    setSections({
      sesion,
      atletas,
      saltos
    })
  }

  const capitalizeStr = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const selectAllAthletes = () => {
    const athleteIds = sections && sections?.atletas.map((athlete, i) => {

      if (athlete.Id === '') {
        const foundAthlete = sections?.saltos.find(aS => aS.Nombre_de_atleta === athlete.Nombre)

        return foundAthlete?.Id_de_atleta;
      }

      return athlete.Id
    }).filter(athlete => Boolean(athlete)) || []

    setSelectedAthletes(athleteIds);
  }

  const clearAllAthletes = () => setSelectedAthletes([])

  const handleSelectAthlete = (id: number) => {
    setSelectedAthletes(prev => {
      if (prev.includes(id)) {
        return prev.filter(prevId => prevId !== id)
      }

      return [
        ...prev,
        id
      ]
    })
  }

  const renderChart = () => {
    if (selectedChartType.value === '') {
      return (
        <Card>
          <CardContent className="flex flex-col items-center gap-3">
            <h2 className="text-base-content opacity-55">Selecciona un tipo de gráfico</h2>
          </CardContent>
        </Card>
      )
    }

    const typeJumpGroupSelected = Object.entries(typeJumpGroups).find(([key, _]) => key.toLowerCase() === selectedJumpType.value)

    if (!typeJumpGroupSelected) return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3">
          <h2 className="text-base-content opacity-55">Selecciona un salto</h2>
        </CardContent>
      </Card>
    );

    if (selectedMetrics.length === 0) {
      return (
        <Card>
          <CardContent className="flex flex-col items-center gap-3">
            <h2 className="text-base-content opacity-55">
              Selecciona {selectedChartType.value === 'combined' ? 'varias métricas' : 'una métrica'} para representar
            </h2>
          </CardContent>
        </Card>
      )
    }

    if (selectedAthletes.length === 0) {
      return (
        <Card>
          <CardContent className="flex flex-col items-center gap-3">
            <h2 className="text-base-content opacity-55">
              Seleccionar athletas para representar los datos
            </h2>
          </CardContent>
        </Card>
      )
    }

    const [_, values] = typeJumpGroupSelected;
    const data = values.filter(value => selectedAthletes.some(athleteId => athleteId === value.Id_de_atleta))

    if (selectedChartType.value === 'combined') {
      return <BarLineChart data={data} metrics={selectedMetrics as (keyof Jump)[]} />
    }

    if (selectedChartType.value === 'scatter') {
      return <ScatterChart data={data} metric={selectedMetrics[0] as keyof Jump} />
    }

    return null;
  }

  useEffect(() => {
    fileSelected && getDataFromFile(fileSelected)
  }, [fileSelected]);

  useEffect(() => {
    if (sections?.saltos && sections?.saltos.length > 0) {
      const types = new Set(sections.saltos.map(salto => salto.Tipo));

      const filteredGroups = sections.saltos.filter((salto) => types.has(salto.Tipo));
      let groups: Partial<Record<SectionName, any[]>> = Object.groupBy(filteredGroups, (salto: Jump) => salto.Tipo);

      setTypeJumpGroups(groups)
    }
  }, [sections]);

  return (
    <main className="flex flex-col gap-5 p-5">
      <div className='flex justify-center w-full'>
        <img src="./src/assets/logo.png" className='aspect-[16/9] object-cover h-40' />
      </div>
      <DragDropZone
        acceptedFileTypes={[".csv", ".xls", ".xlsx"]}
        onFileSelected={setFileSelected}
        isLoading={isLoading}
        onLoad={setIsLoading}
      />

      {isLoading && !fileSelected && (
        <div className="h-full w-full flex justify-center items-center">
          <Loader />
        </div>
      )}

      {!isLoading && fileSelected && (
        <>

          <SessionInfo sections={sections} />
          <Athletes atletas={sections?.atletas || []} />
          <SimpleJumps saltos={sections?.saltos || []} />
          <section className='grid grid-cols-[max-content_1fr] gap-5'>
            <div className='flex gap-6 w-full'>
              <Card className="w-full max-w-[350px]">
                <CardHeader>
                  <CardTitle>Filtros y Opciones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Tipo de Gráfico */}
                  <div className="space-y-2">
                    <Label>Tipo de Gráfico</Label>
                    <Select
                      defaultValue=''
                      value={selectedChartType.value}
                      onValueChange={(chartName) => {
                        setSelectedChartType(({ value: chartName.toLowerCase(), label: capitalizeStr(chartName) }))
                        setSelectedMetrics([])
                      }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un gráfico" />
                      </SelectTrigger>
                      <SelectContent>
                        {chartTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <type.icon className="w-4 h-4" />
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tipo de Salto */}
                  <div className="space-y-2">
                    <Label>Tipo de Salto</Label>
                    <Select
                      defaultValue=''
                      value={selectedJumpType.value}
                      onValueChange={(jumpName) =>
                        setSelectedJumpType(({ value: jumpName.toLowerCase(), label: capitalizeStr(jumpName) }))
                      }>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un salto" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(typeJumpGroups).map((jump) => {
                          return (
                            <SelectItem key={jump} value={jump.toLowerCase()}>
                              {jump}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Métrica */}
                  <div className="space-y-2">
                    <Label>Métrica a Mostrar</Label>
                    <Command>
                      <CommandGroup>
                        {metrics
                          .map(option => {
                            return (
                              <CommandItem
                                disabled={
                                  (selectedChartType.value === 'combined' && selectedMetrics.length === 3 && !selectedMetrics.some(metric => metric === option.value)) || (selectedChartType.value === 'scatter' && selectedMetrics.length === 1 && !selectedMetrics.some(metric => metric === option.value))
                                }
                                key={option.value}
                                onSelect={() =>
                                  setSelectedMetrics(prev =>
                                    prev.includes(option.value)
                                      ? prev.filter(metric => metric !== option.value)
                                      : [...prev, option.value]
                                  )
                                }
                                className="[&_svg:not([class*='text-'])]:text-current"
                              >
                                <Checkbox
                                  id={option.value}
                                  checked={selectedMetrics.includes(option.value)}
                                  className="text-sm"
                                />
                                <Label htmlFor={option.value} className="text-sm">
                                  {option.label}
                                </Label>
                              </CommandItem>
                            )
                          })}
                      </CommandGroup>
                    </Command>
                  </div>

                  {/* Selección de Atletas */}
                  <div className="space-y-3">
                    <div className="flex flex-col justify-between gap-3">
                      <Label>
                        Atletas ({selectedAthletes.length}/{sections?.atletas.length})
                      </Label>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" onClick={selectAllAthletes}>
                          Todos
                        </Button>
                        <Button variant="outline" size="sm" onClick={clearAllAthletes}>
                          Ninguno
                        </Button>
                      </div>
                    </div>

                    <Command>
                      <CommandGroup>
                        {sections?.atletas.map((athlete, i) => (
                          <CommandItem
                            key={`${athlete.Id}-${i}`}
                            onSelect={() => handleSelectAthlete(athlete.Id)}
                            className="[&_svg:not([class*='text-'])]:text-current"
                          >
                            <Checkbox
                              id={athlete.Id}
                              checked={selectedAthletes.includes(athlete.Id)}
                            />
                            <Label htmlFor={athlete.Id} className="text-sm">
                              {athlete.Nombre}
                            </Label>
                          </CommandItem>

                        ))}
                      </CommandGroup>
                    </Command>

                    <div className="max-h-48 overflow-y-auto space-y-2">

                    </div>
                  </div>

                  {/* Atletas Seleccionados */}
                  {selectedAthletes.length > 0 && (
                    <div className="space-y-2">
                      <Label>Seleccionados:</Label>
                      <div className="flex flex-wrap gap-2">
                        {sections?.atletas
                          .filter(athlete => selectedAthletes.includes(athlete.Id))
                          .map(athlete => (
                            <Badge key={athlete.Id} variant="secondary" className="text-xs">
                              {athlete.Nombre}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            {/* Área del Gráfico */}
            <Card className='w-full h-auto'>
              {selectedJumpType.value && (
                <CardHeader>
                  <CardTitle className='text-center'>
                    <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
                      Datos sobre {selectedJumpType.label}
                    </h1>
                  </CardTitle>
                </CardHeader>
              )}
              <CardContent className='w-full'>
                {renderChart()}
              </CardContent>
            </Card>
          </section>
        </>
      )}
    </main>
  )
}

export default App

