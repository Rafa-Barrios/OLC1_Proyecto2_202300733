import { Instruccion } from "../Abstractas/Instruccion";
import { tipoInstruccion } from "../Utilidades/TipoInstruccion";

export class Procedimiento extends Instruccion {
    public id: string;
    public parametros: any[];
    public instrucciones: Instruccion[];

    constructor(
        linea: number,
        columna: number,
        id: string,
        parametros: any[] = [],
        instrucciones: Instruccion[] = []
    ) {
        super(linea, columna, tipoInstruccion.PROCEDIMIENTO);
        this.id = id;
        this.parametros = parametros;
        this.instrucciones = instrucciones;
    }

    public ejecutar(entorno: any): any {
        // Almacena el procedimiento en el entorno como una "función sin retorno"
        if (!entorno.getFuncion(this.id)) {
            entorno.guardarFuncion(this.id, this);
            console.log(`✅ Procedimiento '${this.id}' registrado correctamente en el entorno '${entorno.nombre}'.`);
        } else {
            console.log(`⚠️ Procedimiento '${this.id}' ya existe en el entorno '${entorno.nombre}'.`);
        }

        // No se ejecutan las instrucciones todavía
        return null;
    }
}



