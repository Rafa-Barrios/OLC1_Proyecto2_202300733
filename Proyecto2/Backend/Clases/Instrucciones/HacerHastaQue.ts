import { Instruccion } from "../Abstractas/Instruccion";
import { Expresion } from "../Abstractas/Expresion";
import { Entorno } from "../Entorno/Entorno";
import { tipoInstruccion } from "../Utilidades/TipoInstruccion";
import { Bloque } from "./Bloque";

export class HacerHastaQue extends Instruccion {
    constructor(
        linea: number,
        columna: number,
        public instrucciones: Instruccion[],
        public condicion: Expresion
    ) {
        super(linea, columna, tipoInstruccion.HACER_HASTA_QUE);
    }

    public ejecutar(entorno: Entorno) {
        // Crear un entorno local para el ciclo
        const entornoLocal = new Entorno(entorno, entorno.nombre + "_HACER_HASTA_QUE");

        // Ejecutar el bloque al menos una vez
        do {
            const bloque = new Bloque(this.linea, this.columna, this.instrucciones);
            bloque.ejecutar(entornoLocal);

            // Evaluar la condición
            const condicionResultado = this.condicion.ejecutar(entornoLocal);

            // Si la condición es verdadera, se detiene el ciclo
            if (condicionResultado.valor === true) {
                break;
            }

        } while (true); // Se detiene dentro del ciclo cuando la condición sea verdadera
    }
}
