import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
const apiUrl: string = environment.apiUrl;


export interface Subcategoria{
  id;
  nombre;
  categoria;
  codigoSubCategoria;
  descripcion;
  estado;
}
@Injectable({
  providedIn: 'root'
})
export class SubcategoriasService {

  constructor(private http: HttpClient) { }
  inicializarSubcategoria(){
    return {
      id:0,
      nombre:"",
      categoria:"",
      codigoSubCategoria:"",
      descripcion:"",
      estado:""
    }; 
  }
  obtenerListaSubcategoria(datos){
    return this.http.post<any>(`${apiUrl}/mdp/subCategorias/list/`, datos);;
  }
  obtenerSubcategoria(id){
    return this.http.get<any>(`${apiUrl}/mdp/subCategorias/listOne/${id}`);
  }
  crearSubcategoria(datos){
    return this.http.post<any>(`${apiUrl}/mdp/subCategorias/create/`, datos);
  }
  actualizarSubcategoria(datos){
    return this.http.post<any>(`${apiUrl}/mdp/subCategorias/update/${datos.id}`, datos);
  }
  eliminarSubcategoria(id){
    return this.http.delete<any>(`${apiUrl}/mdp/subCategorias/delete/${id}`);
  }
  obtenerListaSubcategoriasHijas(id){
    return this.http.get<any>(`${apiUrl}/mdp/subCategorias/list/${id}`,{});
  }
}
