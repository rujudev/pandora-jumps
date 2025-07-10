import { read, utils } from 'xlsx';

function parseDateAndHour(dateString: string) {
    const [date, hour] = dateString.split('_')

    return `${date} ${hour.replaceAll('-', ':')}`
}

function keyInclude(key: string, value: string) {
    return key.trim().toLowerCase().includes(value)
}

const formatNumber = (value: number): string => {
    return (value / 1000).toLocaleString('es-ES', {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
    });
};

type SectionName = 'sesion' | 'atletas' | 'saltos';

export const getFileData = async (buffer: ArrayBuffer) => {
    const arrayBuffer = await buffer;

    const workbook = read(arrayBuffer, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: any[][] = utils.sheet_to_json(sheet, { header: 1 });

    const sections: Record<SectionName, any[]> = {
        sesion: [],
        atletas: [],
        saltos: [],
    };

    let current: SectionName | null = null;
    let headers: string[] = [];

    for (const row of rows) {
        const cell = String(row[0] || '').toLowerCase();

        if (cell.includes('**** sesi')) {
            current = 'sesion';
            headers = [];
            continue;
        } else if (cell.includes('**** atletas')) {
            current = 'atletas';
            headers = [];
            continue;
        } else if (cell.includes('**** saltos')) {
            current = 'saltos';
            headers = [];
            continue;
        }

        if (current) {
            if (row.length === 0) {
                continue;
            }

            if (headers.length === 0) {
                headers = row; // primera fila tras el título → cabeceras
                continue;
            }

            const obj: Record<string, any> = {};
            for (let i = 0; i < headers.length; i++) {
                let key = headers[i];

                if (key) {
                    let value = row[i] ?? '';

                    if (key.includes('Ca')) {
                        key = 'Caída';
                    }

                    if (key.includes('Descripc')) {
                        key = 'Descripción'
                    }

                    if (typeof value === 'number') {
                        if (key === 'ID' || key.includes('ID de sesi') || key === 'ID de atleta' || key === 'ID de salto') {
                            if (key === 'ID') {
                                key = 'Id';
                            }

                            if (key.includes('ID de sesi')) {
                                key = 'Id_de_sesion';
                            }

                            if (key === 'ID de atleta') {
                                key = 'Id_de_atleta';
                            } else if (key === 'ID de salto') {
                                key = 'Id_de_salto';
                            }
                        }

                        if (key === 'AÑO Nac') {
                            key = 'Fecha_Nacimiento';
                            value = String(value)
                        }

                        if (keyInclude(key, 'altura') ||
                            keyInclude(key, 'potencia') ||
                            keyInclude(key, 'velocidad inicial') ||
                            keyInclude(key, 'peso kg') ||
                            keyInclude(key, 'rigidez') ||
                            keyInclude(key, 'rsi') ||
                            keyInclude(key, 'caída')
                        ) {
                            if (keyInclude(key, 'velocidad inicial')) {
                                key = 'Velocidad_inicial';
                            }

                            if (keyInclude(key, 'peso kg')) {
                                key = 'Peso_KG'
                            }

                            value = formatNumber(value)
                        }
                    }



                    if (typeof value === 'string') {
                        if (key === 'ID') {
                            key = 'Id';
                        }

                        if (key === 'Nombre de atleta') {
                            key = 'Nombre_de_atleta'
                        }

                        if (key === 'Fecha y hora') {
                            key = 'Fecha_y_hora'
                            value = parseDateAndHour(value);
                        }
                    }

                    obj[key] = value;
                }
            }

            sections[current].push(obj);
        }
    }

    return sections;
};