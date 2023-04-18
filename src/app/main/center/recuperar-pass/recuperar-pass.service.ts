import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RecuperarPassService {
  public apiData: any;
  cambiosEnPassword: BehaviorSubject<any>;

  constructor(private _httpClient: HttpClient) { }


  recuperarPassword(email) {
    return this._httpClient.post<any>(`${environment.apiUrl}/central/auth/password_reset/`,
      { email }
    );
  }
}
