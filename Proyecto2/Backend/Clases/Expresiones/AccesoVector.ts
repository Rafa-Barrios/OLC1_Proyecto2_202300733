import { Entorno } from "../Entorno/Entorno";
import { Simbolo } from "../Entorno/Simbolo";
import { Primitivo } from "../Expresiones/Primitivo";

export class AccesoVector {
    linea: number;
    columna: number;
    id: string;
    indices: any[];

    constructor(linea: number, columna: number, id: string, indices: any[]) {
        this.linea = linea;
        this.columna = columna;
        this.id = id;
        this.indices = indices;
    }

    ejecutar(entorno: Entorno): any {
        const simbolo: Simbolo | null = entorno.getVariable(this.id);
        if (!simbolo) throw new Error(`Vector «${this.id}» no declarado.`);

        let valor = simbolo.valor;

        // Navegar por los índices
        for (let i = 0; i < this.indices.length; i++) {
            const idx = this.indices[i]?.ejecutar
                ? this.indices[i].ejecutar(entorno).valor
                : this.indices[i];

            if (!Array.isArray(valor) || idx < 0 || idx >= valor.length) {
                throw new Error(`Índice fuera de rango en ${this.id} en la posición ${idx}.`);
            }
            valor = valor[idx];
        }

        // Función recursiva para extraer el valor real
        const extraerValor = (v: any): any => {
            if (v instanceof Primitivo) return v.valor;
            if (Array.isArray(v)) return v.map(extraerValor);
            return v;
        }

        return extraerValor(valor);
    }
}



