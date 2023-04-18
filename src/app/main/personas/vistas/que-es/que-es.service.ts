import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QueEsService {

  constructor(private _httpClient: HttpClient) { }
  
  obtenerVideos(id) {
    return this._httpClient.get<any>(`${environment.apiUrl}/central/param/listOne/${id}`,
    );
  }
}
