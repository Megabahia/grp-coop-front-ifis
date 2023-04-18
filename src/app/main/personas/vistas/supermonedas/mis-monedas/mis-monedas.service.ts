import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MisMonedasService {

  constructor(private _httpClient: HttpClient) { }

  obtenerCantidadMonedas(id) {
    return this._httpClient.get<any>(`${environment.apiUrl}/core/monedas/usuario/${id}`);
  }
  obtenerListaSuperMonedas(datos) {
    return this._httpClient.post<any>(`${environment.apiUrl}/core/monedas/list/`, datos);
  }
  
}
