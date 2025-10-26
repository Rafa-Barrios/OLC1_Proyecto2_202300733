import { Funcion } from "../Instrucciones/Funcion";
import { salidasConsola } from "../Utilidades/Salida";
import { Tipo } from "../Utilidades/Tipo";
import { Simbolo } from "./Simbolo";

export class Entorno {
    public ids: Map<string, Simbolo> = new Map<string, Simbolo>();
    public funciones: Map<string, Funcion> = new Map<string, Funcion>();
    public objetos: Map<string, any> = new Map<string, any>();

    constructor(private anterior: Entorno | null, public nombre: string) {}

    // === Guardar Variables ===
    public guardarVariable(id: string, valor: any, tipo: Tipo, linea: number, columna: number) {
        let entornoActual: Entorno = this;
        if (!entornoActual.ids.has(id)) {
            entornoActual.ids.set(id, new Simbolo(valor, id, tipo));
            console.log(`Se guardó la variable '${id}' en el entorno '${entornoActual.nombre}'.`);
        } else {
            console.log(`Error semántico: la variable '${id}' ya existe en el entorno '${entornoActual.nombre}'.`);
        }
    }

    // === Obtener Variables ===
    public getVariable(id: string): Simbolo | null {
        let entorno: Entorno | null = this;
        while (entorno != null) {
            if (entorno.ids.has(id)) {
                console.log(`Buscando variable '${id}' en el entorno '${entorno.nombre}'.`);
                return entorno.ids.get(id)!;
            }
            entorno = entorno.anterior;
        }
        console.log(`Error semántico: la variable '${id}' no existe.`);
        return null;
    }

    // === Modificar Variables ===
    public modificarVariable(id: string, valor: any) {
        let entorno: Entorno | null = this;
        while (entorno != null) {
            if (entorno.ids.has(id)) {
                entorno.ids.get(id)!.valor = valor;
                console.log(`Variable '${id}' actualizada con valor: ${valor}`);
                return; // ✅ Detiene la búsqueda una vez modificada
            }
            entorno = entorno.anterior;
        }
        console.log(`Error semántico: no se encontró la variable '${id}' para modificar.`);
    }

    // === Guardar Función ===
    public guardarFuncion(id: string, funcion: Funcion) {
        let entornoActual: Entorno = this;
        if (!entornoActual.funciones.has(id)) {
            entornoActual.funciones.set(id, funcion);
            console.log(`Se guardó la función '${id}' en el entorno '${entornoActual.nombre}'.`);
        } else {
            console.log(`Error semántico: la función '${id}' ya existe en el entorno '${entornoActual.nombre}'.`);
        }
    }

    // === Obtener Función ===
    public getFuncion(id: string): Funcion | null {
        let entorno: Entorno | null = this;
        while (entorno != null) {
            if (entorno.funciones.has(id)) {
                return entorno.funciones.get(id)!;
            }
            entorno = entorno.anterior;
        }
        console.log(`Error semántico: la función '${id}' no existe.`);
        return null;
    }

    // === Agregar salida a consola ===
    public setPrint(print: string) {
        salidasConsola.push(print);
    }
}
