import { Instruccion } from "../Abstractas/Instruccion";
import { Entorno } from "../Entorno/Entorno";
import { tipoInstruccion } from "../Utilidades/TipoInstruccion";

export class Continuar extends Instruccion {
    constructor(linea: number, columna: number) {
        super(linea, columna, tipoInstruccion.CONTINUAR);
    }

    public ejecutar(entorno: Entorno) {
        // Retornamos un objeto especial para que los ciclos lo detecten
        return { tipo: 'continuar' };
    }
}
