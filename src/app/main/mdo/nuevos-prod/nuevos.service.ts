import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
const apiUrl: string = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class NuevosService {

  constructor(private http: HttpClient) { }
  obtenerListaPredicciones(datos) {
    return this.http.post<any>(`${apiUrl}/mdo/prediccionProductosNuevos/list/`, datos);
  }
  obtenerUltimosProductos(id) {
    return this.http.get<any>(`${apiUrl}/mdo/prediccionProductosNuevos/productosImagenes/${id}`);
  }
  obtenerProductosPrediccion(id) {
    return this.http.get<any>(`${apiUrl}/mdo/prediccionProductosNuevos/prediccionProductosNuevos/${id}`);
  }
}
