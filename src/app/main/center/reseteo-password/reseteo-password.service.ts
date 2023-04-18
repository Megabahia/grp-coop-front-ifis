import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReseteoPasswordService {

  constructor(private _httpClient: HttpClient) { }

  resetearPassword(datos) {
    return this._httpClient.post<any>(`${environment.apiUrl}/central/auth/password_reset/confirm/`,
      datos
    );
  }
}
