import { Expresion } from "../Abstractas/Expresion";
import { Instruccion } from "../Abstractas/Instruccion";
import { Entorno } from "../Entorno/Entorno";
import { tipoInstruccion } from "../Utilidades/TipoInstruccion";
import { Bloque } from "./Bloque";

export class Para extends Instruccion {
    constructor(
        linea: number,
        columna: number,
        public inicio: Instruccion,
        public condicion: Expresion,
        public incremento: Instruccion,
        public instrucciones: Instruccion[]
    ) {
        super(linea, columna, tipoInstruccion.PARA);
    }

    public ejecutar(entorno: Entorno) {
        const entornoLocal = new Entorno(entorno, entorno.nombre + "_PARA");

        // Inicialización (ej. i = 0)
        this.inicio.ejecutar(entornoLocal);

        while (true) {
            const condicion = this.condicion.ejecutar(entornoLocal);
            if (!condicion || !condicion.valor) break;

            // Crear bloque
            const bloque = new Bloque(this.linea, this.columna, this.instrucciones);
            const resultado = bloque.ejecutar(entornoLocal);

            // Verificar señales especiales
            if (resultado !== null && resultado !== undefined) {
                // 🧱 detener → salir del ciclo
                if (resultado.detener === true) break;

                // 🔁 continuar → ejecutar incremento y seguir
                if (resultado.continuar === true) {
                    this.incremento.ejecutar(entornoLocal);
                    // Reiniciar iteración sin cortar el ciclo
                    continue;
                }

                // return u otras señales se propagan
                return resultado;
            }

            // 🚀 ejecutar incremento normal
            this.incremento.ejecutar(entornoLocal);
        }

        return null;
    }
}
