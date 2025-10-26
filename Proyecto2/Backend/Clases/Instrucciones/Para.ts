import { Expresion } from "../Abstractas/Expresion";
import { Instruccion } from "../Abstractas/Instruccion";
import { Entorno } from "../Entorno/Entorno";
import { tipoInstruccion } from "../Utilidades/TipoInstruccion";
import { Bloque } from "./Bloque";

export class Para extends Instruccion {
    constructor(
        linea: number,
        columna: number,
        public inicio: Instruccion,     // Debe ser una asignación o declaración
        public condicion: Expresion,
        public incremento: Instruccion, // Debe ser incremento/decremento
        public instrucciones: Instruccion[]
    ) {
        super(linea, columna, tipoInstruccion.PARA);
    }

    public ejecutar(entorno: Entorno) {
        // Crear un entorno local para el ciclo
        let entornoLocal = new Entorno(entorno, entorno.nombre + "_PARA");

        // Ejecutar la inicialización (i = 0;)
        this.inicio.ejecutar(entornoLocal);

        // Ciclo mientras la condición sea verdadera
        while (true) {
            let condicion = this.condicion.ejecutar(entornoLocal);
            if (!condicion || !condicion.valor) break; // Detener si condición es falsa

            // Ejecutar bloque de instrucciones del ciclo
            let bloque = new Bloque(this.linea, this.columna, this.instrucciones);
            bloque.ejecutar(entornoLocal);

            // Ejecutar incremento/decremento
            this.incremento.ejecutar(entornoLocal);
        }
    }
}