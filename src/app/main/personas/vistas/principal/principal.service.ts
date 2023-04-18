import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrincipalService {

  constructor(private _httpClient: HttpClient) { }

  obtenerCantidadMonedas(id) {
    return this._httpClient.get<any>(`${environment.apiUrl}/core/monedas/usuario/${id}`);
  }

  obtenerProductosMostrar(datos) {
    return this._httpClient.post<any>(`${environment.apiUrl}/central/productos/list/`, datos);
  }
  obtenerProducto(id) {
    return this._httpClient.get<any>(`${environment.apiUrl}/central/productos/listOne/${id}`,
    );
  }

}
