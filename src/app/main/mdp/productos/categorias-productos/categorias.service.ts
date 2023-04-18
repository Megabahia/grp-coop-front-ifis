import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
const apiUrl: string = environment.apiUrl;

export interface Categoria{
  id;
  nombre;
  codigoCategoria;
  descripcion;
  estado;
}
@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  constructor(private http: HttpClient) { }

  inicializarCategoria(){
    return {
      id:0,
      nombre:"",
      codigoCategoria:"",
      descripcion:"",
      estado:""
    }; 
  }

  obtenerCategorias(datos){
    return this.http.post<any>(`${apiUrl}/mdp/categorias/list/`, datos);
  }
  obtenerCategoria(id){
    return this.http.get<any>(`${apiUrl}/mdp/categorias/listOne/${id}`);
  }
  crearCategoria(datos){
    return this.http.post<any>(`${apiUrl}/mdp/categorias/create/`, datos);
  }
  actualizarCategoria(datos){
    return this.http.post<any>(`${apiUrl}/mdp/categorias/update/${datos.id}`, datos);
  }
  eliminarCategoria(id){
    return this.http.delete<any>(`${apiUrl}/mdp/categorias/delete/${id}`);
  }
  obtenerListaCategorias(){
    return this.http.get<any>(`${apiUrl}/mdp/categorias/list/combo/`);
  }
  
}
