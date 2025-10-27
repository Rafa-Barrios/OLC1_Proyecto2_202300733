import { Instruccion } from "../Abstractas/Instruccion";
import { Entorno } from "../Entorno/Entorno";
import { tipoInstruccion } from "../Utilidades/TipoInstruccion";

export class Detener extends Instruccion {
    constructor(linea: number, columna: number) {
        super(linea, columna, tipoInstruccion.DETENER);
    }

    public ejecutar(entorno: Entorno) {
        return { detener: true }; // Señal de ruptura para los ciclos
    }
}
