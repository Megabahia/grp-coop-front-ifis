import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
const apiUrl: string = environment.apiUrl;

export interface PrediccionCross {
  id;
  factura_id;
  fechaPredicciones;
  nombres;
  apellidos;
  identificacion;
  telefono;
  correo;
  cliente;
  negocio;
  created_at;
  updated_at;
  state;
}
export interface Prediccion {
  cliente: {
    cedula;
    correo;
    estado;
    id;
    imagen;
    nombreCompleto;
    paisNacimiento;
  };
  productos: any[];
}
export interface PrediccionesCross {
  predicciones: PrediccionCross[];
}

@Injectable({
  providedIn: "root",
})
export class CrossService {
  constructor(private http: HttpClient) {}
  inicializarPrediccion() {
    return {
      cliente: {
        cedula: "",
        correo: "",
        estado: "",
        id: 0,
        imagen: "",
        nombreCompleto: "",
        paisNacimiento: "",
      },
      productos: [],
    };
  }
  obtenerListaPredicciones(datos) {
    return this.http.post<any>(
      `${apiUrl}/mdo/prediccionCrosseling/list/`,
      datos
    );
  }
  obtenerUltimosProductos(id) {
    return this.http.get<any>(
      `${apiUrl}/mdo/prediccionCrosseling/productosImagenes/${id}`
    );
  }
  obtenerProductosPrediccion(id) {
    return this.http.get<any>(
      `${apiUrl}/mdo/prediccionCrosseling/prediccionCrosseling/${id}`
    );
  }
}
