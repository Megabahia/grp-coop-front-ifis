import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompletarPerfilService {

  constructor(private _httpClient: HttpClient) { }


  subirImagenRegistro(id, imagen) {
    return this._httpClient.post<any>(`${environment.apiUrl}/personas/personas/update/imagen/${id}`, imagen);
  }

  guardarInformacion(datos) {
    return this._httpClient.post<any>(`${environment.apiUrl}/personas/personas/update/${datos.user_id}`, datos);
  }

  obtenerInformacion(id) {
    return this._httpClient.get<any>(`${environment.apiUrl}/personas/personas/listOne/${id}`, );
  }

  validarWhatsapp(datos){
    return this._httpClient.post<any>(`${environment.apiUrl}/personas/personas/validarCodigo/`, datos );

  }

}
