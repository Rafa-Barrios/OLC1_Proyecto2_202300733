import { Expresion } from "../Abstractas/Expresion";
import { Entorno } from "../Entorno/Entorno";
import { Tipo, TipoRetorno } from "../Utilidades/Tipo";
import { TipoExpresion } from "../Utilidades/TipoExpresion";
import { errores } from "../Utilidades/Salida";
import { Error } from "../Utilidades/Error";
import { TipoError } from "../Utilidades/TipoError";

export class Casteo extends Expresion {
    constructor(
        linea: number,
        columna: number,
        public tipoDestino: Tipo,
        public expresion: Expresion
    ) {
        super(linea, columna, TipoExpresion.CASTEO);
    }

    public ejecutar(entorno: Entorno): TipoRetorno {
        const valorOrigen = this.expresion.ejecutar(entorno);

        if (valorOrigen.tipo === Tipo.NULL) {
            errores.push(new Error(
                this.linea,
                this.columna,
                TipoError.SEMANTICO,
                `No se puede castear un valor NULL`
            ));
            return { valor: "NULL", tipo: Tipo.NULL };
        }

        const tipoOrigen = valorOrigen.tipo;
        const val = valorOrigen.valor;

        // === Entero -> Decimal ===
        if (tipoOrigen === Tipo.ENTERO && this.tipoDestino === Tipo.DOUBLE) {
            return { valor: parseFloat(val), tipo: Tipo.DOUBLE };
        }

        // === Decimal -> Entero ===
        if (tipoOrigen === Tipo.DOUBLE && this.tipoDestino === Tipo.ENTERO) {
            return { valor: Math.floor(val), tipo: Tipo.ENTERO };
        }

        // === Entero -> Cadena ===
        if (tipoOrigen === Tipo.ENTERO && this.tipoDestino === Tipo.CADENA) {
            return { valor: val.toString(), tipo: Tipo.CADENA };
        }

        // === Entero -> Caracter ===
        if (tipoOrigen === Tipo.ENTERO && this.tipoDestino === Tipo.CARACTER) {
            return { valor: String.fromCharCode(val), tipo: Tipo.CARACTER };
        }

        // === Decimal -> Cadena ===
        if (tipoOrigen === Tipo.DOUBLE && this.tipoDestino === Tipo.CADENA) {
            return { valor: val.toString(), tipo: Tipo.CADENA };
        }

        // === Caracter -> Entero ===
        if (tipoOrigen === Tipo.CARACTER && this.tipoDestino === Tipo.ENTERO) {
            return { valor: val.charCodeAt(0), tipo: Tipo.ENTERO };
        }

        // === Caracter -> Decimal ===
        if (tipoOrigen === Tipo.CARACTER && this.tipoDestino === Tipo.DOUBLE) {
            return { valor: parseFloat(val.charCodeAt(0)), tipo: Tipo.DOUBLE };
        }

        // ❌ Casteo no permitido
        errores.push(new Error(
            this.linea,
            this.columna,
            TipoError.SEMANTICO,
            `No se puede castear de ${Tipo[tipoOrigen]} a ${Tipo[this.tipoDestino]}`
        ));

        return { valor: "NULL", tipo: Tipo.NULL };
    }
}
