import { Expresion } from "../Abstractas/Expresion";
import { Instruccion } from "../Abstractas/Instruccion";
import { Entorno } from "../Entorno/Entorno";
import { tipoInstruccion } from "../Utilidades/TipoInstruccion";
import { Simbolo } from "../Entorno/Simbolo";

export class Reasignacion extends Instruccion {
    constructor(
        linea: number,
        columna: number,
        private id: string,
        private valor: Expresion
    ) {
        super(linea, columna, tipoInstruccion.REASIGNACION);
    }

    public ejecutar(entorno: Entorno) {
        // Ejecutar la expresión del nuevo valor
        const nuevoValor = this.valor.ejecutar(entorno);

        // Buscar la variable existente en el entorno
        const variableExistente: Simbolo | null = entorno.getVariable(this.id);

        if (variableExistente === null) {
            console.log(`Error semántico: la variable '${this.id}' no existe en el entorno actual.`);
            return;
        }

        // Actualizar valor de la variable
        entorno.modificarVariable(this.id, nuevoValor.valor);
        console.log(`Reasignación: '${this.id}' = ${nuevoValor.valor}`);
    }
}
