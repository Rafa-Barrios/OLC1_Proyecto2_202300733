import { Entorno } from "../Entorno/Entorno";
import { Simbolo } from "../Entorno/Simbolo";
import { Tipo } from "../Utilidades/Tipo";
import { Primitivo } from "../Expresiones/Primitivo";

export class ReasignacionVector {
    linea: number;
    columna: number;
    id: string;
    indices: any[];
    nuevoValor: any;

    constructor(linea: number, columna: number, id: string, indices: any[], nuevoValor: any) {
        this.linea = linea;
        this.columna = columna;
        this.id = id;
        this.indices = indices;
        this.nuevoValor = nuevoValor;
    }

    ejecutar(entorno: Entorno): void {
        const simbolo: Simbolo | null = entorno.getVariable(this.id);
        if (!simbolo) throw new Error(`Vector ${this.id} no declarado.`);

        let valor = simbolo.valor;

        // Evaluar índices
        const indicesEvaluados = this.indices.map(indice =>
            indice.ejecutar ? indice.ejecutar(entorno).valor : indice
        );

        // Navegar hasta la posición a modificar
        for (let i = 0; i < indicesEvaluados.length - 1; i++) {
            const idx = indicesEvaluados[i];
            if (!Array.isArray(valor) || idx < 0 || idx >= valor.length) {
                throw new Error(`Índice fuera de rango en ${this.id} en la posición ${idx}.`);
            }
            valor = valor[idx];
        }

        const ultimoIndice = indicesEvaluados[indicesEvaluados.length - 1];
        if (!Array.isArray(valor) || ultimoIndice < 0 || ultimoIndice >= valor.length) {
            throw new Error(`Índice fuera de rango en ${this.id} en la posición ${ultimoIndice}.`);
        }

        // ✅ Envolver en Primitivo si es literal
        let nuevoValorEvaluado = this.nuevoValor?.ejecutar
            ? this.nuevoValor.ejecutar(entorno)
            : this.nuevoValor;

        if (!(nuevoValorEvaluado instanceof Primitivo)) {
            // Determinar tipo automáticamente (puedes mejorar esto según tu tipado)
            let tipo = typeof nuevoValorEvaluado === "number" ? Tipo.ENTERO :
                       typeof nuevoValorEvaluado === "string" ? Tipo.CADENA :
                       typeof nuevoValorEvaluado === "boolean" ? Tipo.BOOLEANO :
                       Tipo.ENTERO;
            nuevoValorEvaluado = new Primitivo(this.linea, this.columna, nuevoValorEvaluado, tipo);
        }

        valor[ultimoIndice] = nuevoValorEvaluado;

        console.log(`✅ Vector ${this.id} actualizado en posición [${indicesEvaluados.join(", ")}] con valor:`, nuevoValorEvaluado);
    }
}
