import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
const apiUrl: string = environment.apiUrl;

@Injectable({
  providedIn: "root",
})
export class RefilService {
  constructor(private http: HttpClient) {}
  obtenerListaPredicciones(datos) {
    return this.http.post<any>(`${apiUrl}/mdo/prediccionRefil/list/`, datos);
  }
  obtenerUltimosProductos(id) {
    return this.http.get<any>(
      `${apiUrl}/mdo/prediccionRefil/productosImagenes/${id}`
    );
  }
  obtenerProductosPrediccion(id) {
    return this.http.get<any>(
      `${apiUrl}/mdo/prediccionRefil/prediccionRefil/${id}`
    );
  }
}
