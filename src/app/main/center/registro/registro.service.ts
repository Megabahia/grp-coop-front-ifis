import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  constructor(private _httpClient: HttpClient) { }

  registrarUsuario(datos) {
    return this._httpClient.post<any>(`${environment.apiUrl}/central/usuarios/create/`,
      datos
    );
  }
}
