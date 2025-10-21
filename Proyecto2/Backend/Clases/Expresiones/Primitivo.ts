import { Expresion } from "../Abstractas/Expresion";
import { Entorno } from "../Entorno/Entorno";
import { Tipo, TipoRetorno } from "../Utilidades/Tipo";
import { TipoExpresion } from "../Utilidades/TipoExpresion";

export class Primitivo extends Expresion {
    constructor(linea: number, columna: number, public valor: any, public tipo: Tipo) {
        super(linea, columna, TipoExpresion.PRIMITIVO)
    }

    public ejecutar(_: Entorno): TipoRetorno {
    switch (this.tipo) {
        case Tipo.ENTERO:
            return { valor: parseInt(this.valor), tipo: Tipo.ENTERO };

        case Tipo.DOUBLE:
            return { valor: parseFloat(this.valor), tipo: Tipo.DOUBLE };

        case Tipo.BOOLEANO:
            if (this.valor.toString().toLowerCase() === "true") {
                return { valor: true, tipo: Tipo.BOOLEANO };
            } else {
                return { valor: false, tipo: Tipo.BOOLEANO };
            }

        case Tipo.CARACTER:
            return { valor: this.valor, tipo: Tipo.CARACTER };

        case Tipo.CADENA:
            this.valor = this.valor.replace(/\\n/g, '\n');
            this.valor = this.valor.replace(/\\t/g, '\t');
            this.valor = this.valor.replace(/\\"/g, '\"');
            this.valor = this.valor.replace(/\\'/g, '\'');
            this.valor = this.valor.replace(/\\\\/g, '\\');
            return { valor: this.valor, tipo: this.tipo };

        default:
            return { valor: null, tipo: Tipo.NULL };
        }
    }
}