import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesCreditosService {

  constructor(private _httpClient: HttpClient) { }
  obtenerSolicitudesCreditos(datos) {
    return this._httpClient.post<any>(`${environment.apiUrl}/corp/creditoPersonas/list/`, datos);
  }
  obtenersolicitudCredito(id) {
    return this._httpClient.get<any>(`${environment.apiUrl}/corp/creditoPersonas/listOne/${id}`);
  }
  actualizarSolictudesCreditos(datos) {
    return this._httpClient.post<any>(`${environment.apiUrl}/corp/creditoPersonas/update/${datos.get('id')}`, datos);
  }
}
