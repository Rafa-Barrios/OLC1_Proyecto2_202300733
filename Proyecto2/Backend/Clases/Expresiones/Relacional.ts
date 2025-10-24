import { Expresion } from "../Abstractas/Expresion";
import { Entorno } from "../Entorno/Entorno";
import { Tipo, TipoRetorno } from "../Utilidades/Tipo";
import { TipoExpresion } from "../Utilidades/TipoExpresion";

export class Relacional extends Expresion {
    private tipo: Tipo = Tipo.BOOLEANO;

    constructor(
        linea: number,
        columna: number,
        public exp1: Expresion,
        public signo: string,
        public exp2: Expresion
    ) {
        super(linea, columna, TipoExpresion.RELACIONAL);
    }

    public ejecutar(entorno: Entorno): TipoRetorno {
        switch (this.signo) {
            case "==":
                return this.igualdad(entorno);
            case "!=":
                return this.diferente(entorno);
            case ">":
                return this.mayor(entorno);
            case "<":
                return this.menor(entorno);
            case ">=":
                return this.mayorIgual(entorno);
            case "<=":
                return this.menorIgual(entorno);
            default:
                throw new Error(`Operador relacional ${this.signo} no soportado`);
        }
    }

    // --- VALIDACIONES DE TIPOS ---
    private combinacionInvalida(tipo1: Tipo, tipo2: Tipo): boolean {
        const combinacionesInvalidas = [
            [Tipo.ENTERO, Tipo.CADENA],
            [Tipo.ENTERO, Tipo.BOOLEANO],
            [Tipo.DOUBLE, Tipo.BOOLEANO],
            [Tipo.DOUBLE, Tipo.CADENA],
            [Tipo.BOOLEANO, Tipo.CARACTER],
            [Tipo.BOOLEANO, Tipo.CADENA],
            [Tipo.CARACTER, Tipo.CADENA],
        ];

        return combinacionesInvalidas.some(([a, b]) =>
            (a === tipo1 && b === tipo2) || (a === tipo2 && b === tipo1)
        );
    }

    // === IMPLEMENTACIONES DE OPERADORES ===

    private igualdad(entorno: Entorno): TipoRetorno {
        const v1 = this.exp1.ejecutar(entorno);
        const v2 = this.exp2.ejecutar(entorno);
        if (this.combinacionInvalida(v1.tipo, v2.tipo))
            return { valor: "NULL", tipo: Tipo.NULL };
        return { valor: v1.valor == v2.valor, tipo: Tipo.BOOLEANO };
    }

    private diferente(entorno: Entorno): TipoRetorno {
        const v1 = this.exp1.ejecutar(entorno);
        const v2 = this.exp2.ejecutar(entorno);
        if (this.combinacionInvalida(v1.tipo, v2.tipo))
            return { valor: "NULL", tipo: Tipo.NULL };
        return { valor: v1.valor != v2.valor, tipo: Tipo.BOOLEANO };
    }

    private mayor(entorno: Entorno): TipoRetorno {
        const v1 = this.exp1.ejecutar(entorno);
        const v2 = this.exp2.ejecutar(entorno);
        if (this.combinacionInvalida(v1.tipo, v2.tipo))
            return { valor: "NULL", tipo: Tipo.NULL };
        return { valor: v1.valor > v2.valor, tipo: Tipo.BOOLEANO };
    }

    private menor(entorno: Entorno): TipoRetorno {
        const v1 = this.exp1.ejecutar(entorno);
        const v2 = this.exp2.ejecutar(entorno);
        if (this.combinacionInvalida(v1.tipo, v2.tipo))
            return { valor: "NULL", tipo: Tipo.NULL };
        return { valor: v1.valor < v2.valor, tipo: Tipo.BOOLEANO };
    }

    private mayorIgual(entorno: Entorno): TipoRetorno {
        const v1 = this.exp1.ejecutar(entorno);
        const v2 = this.exp2.ejecutar(entorno);
        if (this.combinacionInvalida(v1.tipo, v2.tipo))
            return { valor: "NULL", tipo: Tipo.NULL };
        return { valor: v1.valor >= v2.valor, tipo: Tipo.BOOLEANO };
    }

    private menorIgual(entorno: Entorno): TipoRetorno {
        const v1 = this.exp1.ejecutar(entorno);
        const v2 = this.exp2.ejecutar(entorno);
        if (this.combinacionInvalida(v1.tipo, v2.tipo))
            return { valor: "NULL", tipo: Tipo.NULL };
        return { valor: v1.valor <= v2.valor, tipo: Tipo.BOOLEANO };
    }
}
