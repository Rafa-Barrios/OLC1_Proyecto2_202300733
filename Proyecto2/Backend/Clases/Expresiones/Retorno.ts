import { Expresion } from "../Abstractas/Expresion";
import { Entorno } from "../Entorno/Entorno";
import { Tipo, TipoRetorno } from "../Utilidades/Tipo";
import { TipoExpresion } from "../Utilidades/TipoExpresion";

export class Retorno extends Expresion {
    constructor(linea: number, columna: number, public expresion: Expresion | null) {
        super(linea, columna, TipoExpresion.RETORNO);
    }

    /**
     * Ejecuta el retorno dentro de una función.
     * Devuelve un objeto { valor, tipo } para que LlamadaFuncion lo procese.
     */
    public ejecutar(entorno: Entorno): TipoRetorno {
        if (this.expresion) {
            const resultado = this.expresion.ejecutar(entorno);

            // Si la expresión ya devuelve { valor, tipo }, lo respetamos
            if (resultado && typeof resultado === "object" && "valor" in resultado && "tipo" in resultado) {
                return { valor: resultado.valor, tipo: resultado.tipo };
            }

            // Si devuelve un valor primitivo, inferimos el tipo
            let tipoInferido = Tipo.NULL;
            if (typeof resultado === "number") tipoInferido = Number.isInteger(resultado) ? Tipo.ENTERO : Tipo.DOUBLE;
            else if (typeof resultado === "string") tipoInferido = Tipo.CADENA;
            else if (typeof resultado === "boolean") tipoInferido = Tipo.BOOLEANO;

            return { valor: resultado, tipo: tipoInferido };
        }

        // Retorno sin expresión
        return { valor: null, tipo: Tipo.NULL };
    }
}
