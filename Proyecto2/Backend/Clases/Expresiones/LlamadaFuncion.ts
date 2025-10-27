import { Expresion } from "../Abstractas/Expresion";
import { Entorno } from "../Entorno/Entorno";
import { Funcion } from "../Instrucciones/Funcion";
import { TipoExpresion } from "../Utilidades/TipoExpresion";
import { Tipo } from "../Utilidades/Tipo";

export class LlamadaFuncion extends Expresion {
    constructor(
        linea: number,
        columna: number,
        public idFuncion: string,
        public argumentos: Expresion[] = []
    ) {
        super(linea, columna, TipoExpresion.LLAMADA_FUNCION);
    }

    public ejecutar(entorno: Entorno): any {
        const funcion: Funcion | null = entorno.getFuncion(this.idFuncion);
        if (!funcion) {
            console.error(`Error semántico: la función '${this.idFuncion}' no existe.`);
            return null;
        }

        // Validar cantidad de parámetros
        if (funcion.parametros.length !== this.argumentos.length) {
            console.error(
                `Error semántico: la función '${this.idFuncion}' espera ${funcion.parametros.length} parámetro(s) y se recibieron ${this.argumentos.length}.`
            );
            return null;
        }

        // Crear entorno local
        const local = new Entorno(entorno, `${this.idFuncion}_local`);

        // Asignar valores a los parámetros
        for (let i = 0; i < this.argumentos.length; i++) {
            const argValor = this.argumentos[i].ejecutar(entorno);
            local.guardarVariable(
                funcion.parametros[i].nombre,
                argValor?.valor ?? argValor,
                funcion.parametros[i].tipo,
                this.linea,
                this.columna
            );
        }

        // Ejecutar instrucciones de la función
        for (const instruccion of funcion.instrucciones) {
            const resultado = instruccion.ejecutar(local);

            // Si hay un retorno explícito ({ valor, tipo })
            if (resultado && resultado.valor !== undefined && resultado.tipo !== undefined) {
                return resultado.valor; // ✅ devolvemos solo el valor puro
            }
        }

        // Si no hay retorno explícito, devolvemos null
        return null;
    }
}
