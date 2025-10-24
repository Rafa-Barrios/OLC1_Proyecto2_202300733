import { Expresion } from "../Abstractas/Expresion";
import { Instruccion } from "../Abstractas/Instruccion";
import { Entorno } from "../Entorno/Entorno";
import { Error } from "../Utilidades/Error";
import { errores } from "../Utilidades/Salida";
import { Tipo, TipoRetorno } from "../Utilidades/Tipo";
import { TipoError } from "../Utilidades/TipoError";
import { tipoInstruccion } from "../Utilidades/TipoInstruccion";

export class DeclaracionID extends Instruccion {
    constructor(
        linea: number,
        columna: number,
        private id: string | string[],            // Puede ser simple o múltiple
        private tipo: Tipo,
        private valor: Expresion | Expresion[] | null // Puede ser simple o lista de expresiones
    ) {
        super(linea, columna, tipoInstruccion.DECLARACION_VARIABLE);
    }

    public ejecutar(entorno: Entorno): any {
        // Declaración simple
        if (typeof this.id === "string") {
            if (this.valor) {
                const valor: TipoRetorno = (this.valor as Expresion).ejecutar(entorno);
                if (valor.tipo === this.tipo) {
                    entorno.guardarVariable(this.id, valor.valor, this.tipo, this.linea, this.columna);
                } else {
                    errores.push(new Error(this.linea, this.columna, TipoError.SEMANTICO,
                        `Los tipos de datos no coinciden, se esperaba ${Tipo[this.tipo]} y se obtuvo ${Tipo[valor.tipo]}`
                    ));
                }
            } else {
                // Valor por defecto
                let valorPorDefecto: any = this.getValorPorDefecto();
                entorno.guardarVariable(this.id, valorPorDefecto, this.tipo, this.linea, this.columna);
            }
        }
        // Declaración múltiple
        else if (Array.isArray(this.id)) {
            const ids = this.id;
            const valores = Array.isArray(this.valor) ? this.valor : [];

            if (valores.length > 0 && valores.length !== ids.length) {
                errores.push(new Error(this.linea, this.columna, TipoError.SEMANTICO,
                    `Cantidad de variables (${ids.length}) y valores (${valores.length}) no coinciden`
                ));
                return;
            }

            ids.forEach((nombre, index) => {
                if (valores.length > 0) {
                    const valorEvaluado: TipoRetorno = (valores[index] as Expresion).ejecutar(entorno);
                    if (valorEvaluado.tipo === this.tipo) {
                        entorno.guardarVariable(nombre, valorEvaluado.valor, this.tipo, this.linea, this.columna);
                    } else {
                        errores.push(new Error(this.linea, this.columna, TipoError.SEMANTICO,
                            `Los tipos de datos no coinciden para la variable "${nombre}", se esperaba ${Tipo[this.tipo]} y se obtuvo ${Tipo[valorEvaluado.tipo]}`
                        ));
                    }
                } else {
                    // Sin valor inicial
                    let valorPorDefecto: any = this.getValorPorDefecto();
                    entorno.guardarVariable(nombre, valorPorDefecto, this.tipo, this.linea, this.columna);
                }
            });
        }
    }

    private getValorPorDefecto(): any {
        switch (this.tipo) {
            case Tipo.ENTERO: return 0;
            case Tipo.DOUBLE: return 0.0;
            case Tipo.BOOLEANO: return false;
            case Tipo.CADENA: return "";
            case Tipo.CARACTER: return "\0";
            default: return null;
        }
    }
}
