import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CargarCreditosPreAprobadosService {

  constructor(private _httpClient: HttpClient) {
  }

  cargarCreditos(datos) {
    return this._httpClient.post<any>(`${environment.apiUrl}/corp/creditoPersonas/upload/creditos/preaprobados/`, datos);
  }

  preautorizarCobro(datos) {
    return this._httpClient.post<any>(`${environment.apiUrl}/corp/cobrarSupermonedas/update/${datos.id}`, datos);
  }

  crearArchivoPreAprobados(datos) {
    return this._httpClient.post<any>(`${environment.apiUrl}/corp/creditoArchivos/create/`, datos);
  }

  obtenerListaArchivosPreAprobados(datos) {
    return this._httpClient.post<any>(`${environment.apiUrl}/corp/creditoArchivos/list/`, datos);
  }

  eliminarArchivosPreAprobados(id) {
    return this._httpClient.delete<any>(`${environment.apiUrl}/corp/creditoArchivos/delete/${id}`);
  }

  subirArchivosPreAprobados(id) {
    return this._httpClient.post<any>(`${environment.apiUrl}/corp/creditoArchivos/upload/creditos/preaprobados/${id}`, {});
  }

  subirMicroCreditosPreAprobados(id) {
    return this._httpClient.post<any>(`${environment.apiUrl}/corp/creditoArchivos/upload/microcreditos/preaprobados/${id}`, {});
  }

}
