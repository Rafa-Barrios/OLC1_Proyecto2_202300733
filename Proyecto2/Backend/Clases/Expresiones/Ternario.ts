import { Expresion } from "../Abstractas/Expresion";
import { Entorno } from "../Entorno/Entorno";
import { Tipo, TipoRetorno } from "../Utilidades/Tipo";
import { TipoExpresion } from "../Utilidades/TipoExpresion";
import { errores } from "../Utilidades/Salida";
import { Error } from "../Utilidades/Error";
import { TipoError } from "../Utilidades/TipoError";

export class Ternario extends Expresion {
    constructor(
        linea: number,
        columna: number,
        public condicion: Expresion,
        public verdadero: Expresion,
        public falso: Expresion
    ) {
        super(linea, columna, TipoExpresion.TERNARIO);
    }

    public ejecutar(entorno: Entorno): TipoRetorno {
        // Evaluar la condición (debe ser booleano)
        const cond = this.condicion.ejecutar(entorno);

        if (cond.tipo !== Tipo.BOOLEANO) {
            errores.push(new Error(
                this.linea,
                this.columna,
                TipoError.SEMANTICO,
                `La condición del operador ternario debe ser booleana, se obtuvo ${Tipo[cond.tipo]}.`
            ));
            return { valor: "NULL", tipo: Tipo.NULL };
        }

        // Solo evaluamos la rama seleccionada
        const rama = cond.valor ? this.verdadero : this.falso;
        const resultado = rama.ejecutar(entorno);

        // Devolvemos exactamente lo que produzca la rama (valor y tipo)
        return { valor: resultado.valor, tipo: resultado.tipo };
    }
}


