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
        // Creamos un nuevo entorno local para el ciclo
        const entornoLocal = new Entorno(entorno, entorno.nombre + "_MIENTRAS");

        while (true) {
            const resultadoCondicion = this.condicion.ejecutar(entornoLocal);

            // Verificar tipo booleano
            if (resultadoCondicion.tipo !== Tipo.BOOLEANO) {
                console.error(
                    `Error semántico: la condición del ciclo 'mientras' no es booleana (${this.linea}:${this.columna})`
                );
                break;
            }

            // Evaluar la condición
            if (!resultadoCondicion.valor) break;

            // Ejecutar el bloque interno
            const resultado = this.bloque.ejecutar(entornoLocal);

            // Si alguna instrucción retorna algo (return, break, etc.), lo propagamos
            if (resultado !== null && resultado !== undefined) {
                // Si más adelante agregas soporte a break/continue/return, puedes manejarlo aquí
                return resultado;
            }
        }

        return null;
    }
}
