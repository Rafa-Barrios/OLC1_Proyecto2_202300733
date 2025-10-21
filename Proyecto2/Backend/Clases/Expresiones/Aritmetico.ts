import { Expresion } from "../Abstractas/Expresion";
import { Entorno } from "../Entorno/Entorno";
import { suma } from "../Utilidades/OperacionesDominante";
import { Tipo, TipoRetorno } from "../Utilidades/Tipo";
import { TipoExpresion } from "../Utilidades/TipoExpresion";

export class Aritmetico extends Expresion {
    private tipo: Tipo = Tipo.NULL;

    constructor (linea: number, columna: number, public exp1: Expresion, public signo: string, public exp2: Expresion) {
        super(linea, columna, TipoExpresion.ARITMETICO);
    }

    public ejecutar(entorno: Entorno): TipoRetorno {
        switch (this.signo) {
            case "+":
                return this.sumar(entorno);
            case "-":
                return this.restar(entorno);
            case "*":
                return this.multiplicar(entorno);
            case "/":
                return this.dividir(entorno);
            default:
                throw new Error(`Operador ${this.signo} no soportado`);
        }
    }

    private getNumeric(v: TipoRetorno): number {
        if (v.tipo === Tipo.BOOLEANO) return v.valor ? 1 : 0;
        if (v.tipo === Tipo.CARACTER) return v.valor.charCodeAt(0);
        return Number(v.valor);
    }

    private sumar(entorno: Entorno): TipoRetorno {
        const valor1 = this.exp1.ejecutar(entorno);
        const valor2 = this.exp2.ejecutar(entorno);
        this.tipo = suma[valor1.tipo][valor2.tipo];

        if (this.tipo === Tipo.NULL) return { valor: 'NULL', tipo: Tipo.NULL };

        if (this.tipo === Tipo.ENTERO) {
            return { valor: Math.floor(this.getNumeric(valor1) + this.getNumeric(valor2)), tipo: this.tipo };
        } else if (this.tipo === Tipo.DOUBLE) {
            return { valor: this.getNumeric(valor1) + this.getNumeric(valor2), tipo: this.tipo };
        } else if (this.tipo === Tipo.CADENA) {
            return { valor: valor1.valor.toString() + valor2.valor.toString(), tipo: this.tipo };
        }

        return { valor: 'NULL', tipo: Tipo.NULL };
    }

    private restar(entorno: Entorno): TipoRetorno {
        const valor1 = this.exp1.ejecutar(entorno);
        const valor2 = this.exp2.ejecutar(entorno);
        this.tipo = suma[valor1.tipo][valor2.tipo];

        if (this.tipo === Tipo.NULL) return { valor: 'NULL', tipo: Tipo.NULL };

        if (this.tipo === Tipo.ENTERO) {
            return { valor: Math.floor(this.getNumeric(valor1) - this.getNumeric(valor2)), tipo: this.tipo };
        } else if (this.tipo === Tipo.DOUBLE) {
            return { valor: this.getNumeric(valor1) - this.getNumeric(valor2), tipo: this.tipo };
        }

        return { valor: 'NULL', tipo: Tipo.NULL };
    }

    private multiplicar(entorno: Entorno): TipoRetorno {
        const valor1 = this.exp1.ejecutar(entorno);
        const valor2 = this.exp2.ejecutar(entorno);

        // Reutilizamos la tabla de suma/resta para obtener el tipo resultante
        // Solo consideramos combinaciones válidas: Entero, Double, Caracter
        this.tipo = suma[valor1.tipo]?.[valor2.tipo] ?? Tipo.NULL;

        // Filtrar los casos inválidos según la tabla de multiplicación
        if (this.tipo === Tipo.BOOLEANO || this.tipo === Tipo.CADENA) {
            return { valor: 'NULL', tipo: Tipo.NULL };
        }

        if (this.tipo === Tipo.NULL) return { valor: 'NULL', tipo: Tipo.NULL };

        const getNumeric = (v: TipoRetorno) => {
            if (v.tipo === Tipo.BOOLEANO) return 1; // Opcional, aunque booleanos no multiplican
            if (v.tipo === Tipo.CARACTER) return v.valor.charCodeAt(0);
            return Number(v.valor);
        };

        if (this.tipo === Tipo.ENTERO) {
            return { valor: Math.floor(getNumeric(valor1) * getNumeric(valor2)), tipo: this.tipo };
        } else if (this.tipo === Tipo.DOUBLE) {
            return { valor: getNumeric(valor1) * getNumeric(valor2), tipo: this.tipo };
        }

        return { valor: 'NULL', tipo: Tipo.NULL };
    }

    private dividir(entorno: Entorno): TipoRetorno {
        const valor1 = this.exp1.ejecutar(entorno);
        const valor2 = this.exp2.ejecutar(entorno);
        this.tipo = suma[valor1.tipo][valor2.tipo]; // Usamos la misma tabla de tipos dominante

        if (this.tipo === Tipo.NULL) return { valor: 'NULL', tipo: Tipo.NULL };

        const getNumeric = (v: TipoRetorno) => {
            if (v.tipo === Tipo.BOOLEANO) return v.valor ? 1 : 0;
            if (v.tipo === Tipo.CARACTER) return v.valor.charCodeAt(0);
            return Number(v.valor);
        };

        // Evitamos división entre cero
        const num1 = getNumeric(valor1);
        const num2 = getNumeric(valor2);
        if (num2 === 0) return { valor: 'NULL', tipo: Tipo.NULL };

        if (this.tipo === Tipo.DOUBLE) {
            return { valor: num1 / num2, tipo: this.tipo };
        } else if (this.tipo === Tipo.ENTERO) {
            // En división siempre damos Decimal si ambos son enteros
            return { valor: num1 / num2, tipo: Tipo.DOUBLE };
        }

        return { valor: 'NULL', tipo: Tipo.NULL };
    }
}