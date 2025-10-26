import { Expresion } from "../Abstractas/Expresion";
import { Instruccion } from "../Abstractas/Instruccion";
import { Entorno } from "../Entorno/Entorno";
import { tipoInstruccion } from "../Utilidades/TipoInstruccion";
import { Bloque } from "./Bloque";

interface CondicionBloque {
    condicion: Expresion;
    instrucciones: Instruccion[];
}

export class Si extends Instruccion {
    private bloque: Bloque;
    private elseIfBloques: CondicionBloque[] = [];
    private bloqueElse: Bloque | null = null;

    constructor(
        linea: number,
        columna: number,
        private condicion: Expresion,
        private instrucciones: Instruccion[]
    ) {
        super(linea, columna, tipoInstruccion.SI);
        this.bloque = new Bloque(linea, columna, instrucciones);
    }

    public agregarElseIf(condicion: Expresion, instrucciones: Instruccion[]) {
        this.elseIfBloques.push({ condicion, instrucciones });
    }

    public agregarElse(instrucciones: Instruccion[]) {
        this.bloqueElse = new Bloque(this.linea, this.columna, instrucciones);
    }

    public ejecutar(entorno: Entorno) {
        const entornoLocal = new Entorno(entorno, entorno.nombre + "_SI");

        // Bloque principal if
        const valorIf = this.condicion.ejecutar(entorno).valor;
        if (valorIf) {
            return this.bloque.ejecutar(entornoLocal); // RETORNA inmediatamente si se cumple
        }

        // Bloques else if
        for (const elseIf of this.elseIfBloques) {
            const valorElseIf = elseIf.condicion.ejecutar(entorno).valor;
            if (valorElseIf) {
                return new Bloque(this.linea, this.columna, elseIf.instrucciones).ejecutar(entornoLocal); // RETORNA
            }
        }

        // Bloque else final
        if (this.bloqueElse) {
            return this.bloqueElse.ejecutar(entornoLocal); // RETORNA
        }

        return null; // Ningún bloque se ejecutó
    }
}
