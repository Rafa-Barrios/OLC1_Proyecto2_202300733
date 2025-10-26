import { Tipo } from "../Utilidades/Tipo";
import { Entorno } from "../Entorno/Entorno";
import { Simbolo } from "../Entorno/Simbolo";
import { Primitivo } from "../Expresiones/Primitivo";

export class DeclaracionVector {
    linea: number;
    columna: number;
    id: string;
    tipoBase: Tipo;
    valores: any;
    dimensiones: number;
    tamano: any;

    constructor(linea: number, columna: number, id: string, tipoBase: Tipo, valores: any, dimensiones = 1, tamano: any = null) {
        this.linea = linea;
        this.columna = columna;
        this.id = id;
        this.tipoBase = tipoBase;
        this.valores = valores;
        this.dimensiones = dimensiones;
        this.tamano = tamano;
    }

    ejecutar(entorno: Entorno) {
        let valorFinal: any = null;

        // Tipo 1: tamaño explícito
        if (this.tamano !== null) {
            if (this.dimensiones === 1) {
                valorFinal = Array(this.tamano).fill(null);
            } else if (this.dimensiones === 2 && Array.isArray(this.tamano)) {
                const [f, c] = this.tamano;
                valorFinal = Array(f).fill(null).map(() => Array(c).fill(null));
            }
        } 
        // Tipo 2: lista de valores
        else {
            if (Array.isArray(this.valores)) {
                if (this.dimensiones === 1) {
                    // 1D: evaluar cada valor
                    valorFinal = this.valores.map((v: any) => (v?.ejecutar ? v.ejecutar(entorno) : v));
                } else if (this.dimensiones === 2) {
                    // 2D: lista de listas
                    valorFinal = this.valores.map((fila: any[]) =>
                        fila.map((v: any) => (v?.ejecutar ? v.ejecutar(entorno) : v))
                    );
                }
            } else {
                valorFinal = this.valores;
            }
        }

        entorno.guardarVariable(this.id, valorFinal, this.tipoBase, this.linea, this.columna);
        console.log(`✅ Vector ${this.id} creado con valor:`, valorFinal);
        return this;
    }
}

