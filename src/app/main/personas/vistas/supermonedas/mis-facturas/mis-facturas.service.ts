import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MisFacturasService {

  constructor(private _httpClient: HttpClient) { }

  obtenerFacturas(datos) {
    return this._httpClient.post<any>(`${environment.apiUrl}/central/facturas/list/`, datos);
  }
}
