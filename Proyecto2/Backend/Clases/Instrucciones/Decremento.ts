import { Expresion } from "../Abstractas/Expresion";
import { Instruccion } from "../Abstractas/Instruccion";
import { Entorno } from "../Entorno/Entorno";
import { tipoInstruccion } from "../Utilidades/TipoInstruccion";
import { Bloque } from "./Bloque";

export class Decremento extends Instruccion {
    constructor(linea: number, columna: number, public id: string) { 
        super(linea, columna, tipoInstruccion.DECREMENTO);
    }

    public ejecutar(entorno: Entorno) {
        let valor = entorno.getVariable(this.id);
        console.log("Valor decremento: ", valor);
        if (valor) {
            entorno.modificarVariable(this.id, valor.valor - 1);
        }
    }
}
