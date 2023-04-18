import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrincipalService {

  constructor(private _httpClient: HttpClient) { }

  obtenerListaCobros(datos) {
    return this._httpClient.post<any>(`${environment.apiUrl}/corp/cobrarSupermonedas/list/`,datos);
  }

  preautorizarCobro(datos){
    return this._httpClient.post<any>(`${environment.apiUrl}/corp/cobrarSupermonedas/update/${datos.id}`,datos);
  }

}
