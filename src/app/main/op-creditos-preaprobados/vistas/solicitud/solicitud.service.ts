import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SolicitudPreService {

  constructor(private _httpClient: HttpClient) { }

  obtenerListaSolicitudes(datos) {
    return this._httpClient.post<any>(`${environment.apiUrl}/corp/creditoPreaprobados/list/ifis/`, datos);
  }
  obtenerCredito(id) {
    return this._httpClient.get<any>(`${environment.apiUrl}/corp/creditoPreaprobados/listOne/${id}`,);
  }
  actualizarCredito(datos) {
    return this._httpClient.post<any>(`${environment.apiUrl}/corp/creditoPreaprobados/update/${datos.id}`, datos);
  }
  preautorizarCobro(datos) {
    return this._httpClient.post<any>(`${environment.apiUrl}/corp/cobrarSupermonedas/update/${datos.id}`, datos);
  }

}
