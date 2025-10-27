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
        const entornoLocal = new Entorno(entorno, entorno.nombre + "_HACER_HASTA_QUE");

        do {
            const bloque = new Bloque(this.linea, this.columna, this.instrucciones);
            const resultado = bloque.ejecutar(entornoLocal);

            if (resultado !== null && resultado !== undefined) {
                // Manejar 'detener'
                if (resultado.detener === true) break;

                // Manejar 'continuar': saltar al siguiente ciclo
                if (resultado.continuar === true) {
                    continue;
                }

                // Propagar otras señales (como return)
                return resultado;
            }

            const condicionResultado = this.condicion.ejecutar(entornoLocal);

            if (condicionResultado.tipo !== undefined && condicionResultado.tipo !== null &&
                condicionResultado.valor === true) {
                break;
            }

        } while (true);

        return null;
    }
}

