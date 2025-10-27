import { Instruccion } from "../Abstractas/Instruccion";
import { Expresion } from "../Abstractas/Expresion";
import { Entorno } from "../Entorno/Entorno";
import { tipoInstruccion } from "../Utilidades/TipoInstruccion";
import { Tipo } from "../Utilidades/Tipo";
import { Bloque } from "./Bloque";

export class Mientras extends Instruccion {
    private bloque: Bloque;

    constructor(
        linea: number,
        columna: number,
        private condicion: Expresion,
        private instrucciones: Instruccion[]
    ) {
        super(linea, columna, tipoInstruccion.MIENTRAS);
        this.bloque = new Bloque(linea, columna, instrucciones);
    }

    public ejecutar(entorno: Entorno) {
        const entornoLocal = new Entorno(entorno, entorno.nombre + "_MIENTRAS");

        while (true) {
            const resultadoCondicion = this.condicion.ejecutar(entornoLocal);

            if (resultadoCondicion.tipo !== Tipo.BOOLEANO) {
                console.error(
                    `Error semántico: la condición del ciclo 'mientras' no es booleana (${this.linea}:${this.columna})`
                );
                break;
            }

            if (!resultadoCondicion.valor) break;

            const resultado = this.bloque.ejecutar(entornoLocal);

            if (resultado !== null && resultado !== undefined) {

                // Manejo de 'detener'
                if (resultado.detener === true) break;

                // Manejo de 'continuar': saltar a la siguiente iteración
                if (resultado.continuar === true) continue;

                // Propagar cualquier otra instrucción especial (como return)
                return resultado;
            }
        }

        return null;
    }
}
