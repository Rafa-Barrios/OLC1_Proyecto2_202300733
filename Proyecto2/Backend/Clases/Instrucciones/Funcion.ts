import { Instruccion } from "../Abstractas/Instruccion";
import { tipoInstruccion } from "../Utilidades/TipoInstruccion";
import { Tipo } from "../Utilidades/Tipo";
import { Entorno } from "../Entorno/Entorno";

export class Funcion extends Instruccion {
    public id: string;
    public tipoRetorno: Tipo;
    public parametros: any[];
    public instrucciones: Instruccion[];

    constructor(
        linea: number,
        columna: number,
        id: string,
        tipoRetorno: Tipo,
        parametros: any[] = [],
        instrucciones: Instruccion[] = []
    ) {
        super(linea, columna, tipoInstruccion.FUNCION);
        this.id = id;
        this.tipoRetorno = tipoRetorno;
        this.parametros = parametros;
        this.instrucciones = instrucciones;
    }

    /**
     * Solo registra la función en el entorno.
     * NO debe ejecutar instrucciones al declararla.
     */
    public ejecutar(entorno: Entorno): void {
        if (!entorno.getFuncion(this.id)) {
            entorno.guardarFuncion(this.id, this);
            console.log(`✅ Función '${this.id}' registrada correctamente en el entorno '${entorno.nombre}'.`);
            console.log(`   - Tipo de retorno: ${this.tipoRetorno}`);
            console.log(`   - Parámetros: ${this.parametros.map(p => p.nombre).join(", ") || "ninguno"}`);
        } else {
            console.log(`⚠️ Función '${this.id}' ya existe en el entorno '${entorno.nombre}'.`);
        }
    }
}
