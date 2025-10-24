import { Expresion } from "../Abstractas/Expresion";
import { Entorno } from "../Entorno/Entorno";
import { Tipo, TipoRetorno } from "../Utilidades/Tipo";
import { TipoExpresion } from "../Utilidades/TipoExpresion";

export class Logico extends Expresion {
    private tipo: Tipo = Tipo.NULL;

    constructor(
        linea: number,
        columna: number,
        public exp1: Expresion | undefined,
        public signo: string,
        public exp2?: Expresion
    ) {
        super(linea, columna, TipoExpresion.LOGICO);
    }

    public ejecutar(entorno: Entorno): TipoRetorno {
        switch (this.signo) {
            case "||":
                return this.or(entorno);
            case "&&":
                return this.and(entorno);
            case "!":
                return this.not(entorno);
            default:
                throw new Error(`Operador lógico ${this.signo} no soportado`);
        }
    }

    private or(entorno: Entorno): TipoRetorno {
        const v1 = this.exp1?.ejecutar(entorno);
        const v2 = this.exp2?.ejecutar(entorno);

        if (!v1 || !v2 || v1.tipo !== Tipo.BOOLEANO || v2.tipo !== Tipo.BOOLEANO) {
            return { valor: "NULL", tipo: Tipo.NULL };
        }

        this.tipo = Tipo.BOOLEANO;
        return { valor: v1.valor || v2.valor, tipo: this.tipo };
    }

    private and(entorno: Entorno): TipoRetorno {
        const v1 = this.exp1?.ejecutar(entorno);
        const v2 = this.exp2?.ejecutar(entorno);

        if (!v1 || !v2 || v1.tipo !== Tipo.BOOLEANO || v2.tipo !== Tipo.BOOLEANO) {
            return { valor: "NULL", tipo: Tipo.NULL };
        }

        this.tipo = Tipo.BOOLEANO;
        return { valor: v1.valor && v2.valor, tipo: this.tipo };
    }

    private not(entorno: Entorno): TipoRetorno {
        const v = this.exp2?.ejecutar(entorno);
        if (!v || v.tipo !== Tipo.BOOLEANO) {
            return { valor: "NULL", tipo: Tipo.NULL };
        }

        this.tipo = Tipo.BOOLEANO;
        return { valor: !v.valor, tipo: this.tipo };
    }
}
