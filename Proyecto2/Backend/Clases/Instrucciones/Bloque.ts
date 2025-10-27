import { Instruccion } from "../Abstractas/Instruccion";
import { Entorno } from "../Entorno/Entorno";
import { tipoInstruccion } from "../Utilidades/TipoInstruccion";

export class Bloque extends Instruccion {
    constructor(linea: number, columna: number, private instrucciones: Instruccion[]) {
        super(linea, columna, tipoInstruccion.BLOQUE);
    }

    public ejecutar(entorno: Entorno) {
        const nuevoEntorno = new Entorno(entorno, entorno.nombre);

        for (const instruccion of this.instrucciones) {
            try {
                const resultado = instruccion.ejecutar(nuevoEntorno);

                // 🔁 Si hay señal de detener o continuar, la propagamos inmediatamente
                if (resultado && (resultado.detener || resultado.continuar)) {
                    return resultado;
                }

                // Si hay cualquier otro resultado (return u otro), también se propaga
                if (resultado) return resultado;

            } catch (_) {}
        }

        return null;
    }
}
