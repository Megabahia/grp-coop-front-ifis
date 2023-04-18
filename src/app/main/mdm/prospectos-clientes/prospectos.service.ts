import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

const  apiUrl:string  = environment.apiUrl;


export interface Prospecto {
  nombres:string,
  apellidos:string,
  telefono:string,
  tipoCliente:string,
  whatsapp:string,
  facebook:string,
  twitter:string,
  instagram:string,
  correo1:string,
  correo2:string,
  ciudad:string,
  canal:string,
  codigoProducto:string,
  nombreProducto:string,
  precio:number,
  tipoPrecio:string,
  nombreVendedor:string,
  confirmacionProspecto:string,
  imagen:string,
}
@Injectable({
  providedIn: 'root'
})
export class ProspectosService {

  constructor(private http: HttpClient) { }
  obtenerFiltro(tipo){
    return this.http.post<any>(`${apiUrl}/mdm/param/list/tipo/todos/`, {tipo});
  }
  obtenerVendedor(rol){
    return this.http.post<any>(`${apiUrl}/adm/usuarios/list/rol/`, {rol});
  }
  obtenerLista(parametros){
    return this.http.post<any>(`${apiUrl}/mdm/prospectosClientes/list/`, parametros);
  }
  crearProspectos(data){
    return this.http.post<any>(`${apiUrl}/mdm/prospectosClientes/create/`, data);
  }
  obtenerProspecto(id){
    return this.http.get<any>(`${apiUrl}/mdm/prospectosClientes/listOne/${id}`);
  }
  insertarImagen(id,imagen){
    return this.http.post<any>(`${apiUrl}/mdm/prospectosClientes/update/imagen/${id}`, imagen);
  }

  actualizarProspecto(id,confirmacionProspecto){
    return this.http.post<any>(`${apiUrl}/mdm/prospectosClientes/update/${id}`, {confirmacionProspecto});
  }
  eliminarProspecto(id){
    return this.http.delete<any>(`${apiUrl}/mdm/prospectosClientes/delete/${id}` );
  }
}
