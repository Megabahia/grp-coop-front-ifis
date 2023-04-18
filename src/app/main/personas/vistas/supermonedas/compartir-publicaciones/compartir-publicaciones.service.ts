import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompartirPublicacionesService {

  constructor(private _httpClient: HttpClient) { }

  obtenerPublicaciones(datos) {
    return this._httpClient.post<any>(`${environment.apiUrl}/central/publicaciones/list/`, datos);
  }
  guardarPublicacion(datos){
    return this._httpClient.post<any>(`${environment.apiUrl}/central/publicaciones/compartir/`, datos);

  }
}
