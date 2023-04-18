import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
const apiUrl: string = environment.apiUrl;

export interface Producto {
  id;
  categoria;
  subCategoria;
  nombre;
  descripcion;
  codigoBarras;
  refil;
  stock;
  costoCompra;
  precioVentaA;
  precioVentaB;
  precioVentaC;
  precioVentaD;
  precioVentaE;
  precioVentaBultos;
  parametrizacion;
  estado;
  variableRefil;
  imagenes;
  fechaCaducidad;
  fechaElaboracion;
}
export interface FichaTecnicaProducto {
  id;
  producto;
  codigo;
  nombreAtributo;
  valor;
}

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(private http: HttpClient) { }
  inicializarProducto() {
    return {
      id: 0,
      categoria: "",
      subCategoria: "",
      nombre: "",
      descripcion: "",
      codigoBarras: "",
      refil: 0,
      stock: 0,
      costoCompra: 0,
      precioVentaA: 0,
      precioVentaB: 0,
      precioVentaC: 0,
      precioVentaD: 0,
      precioVentaE: 0,
      precioVentaBultos: 0,
      parametrizacion: '',
      estado: "",
      variableRefil: "",
      imagenes: [],
      fechaCaducidad: "",
      fechaElaboracion: ""
    }
  }
  inicializarFichaTecnica() {
    return {
      id: 0,
      producto: 0,
      codigo: "",
      nombreAtributo: "",
      valor: ""
    }
  }
  obtenerListaProductos(datos) {
    return this.http.post<any>(`${apiUrl}/mdp/productos/list/`, datos);
  }
  obtenerProducto(id) {
    return this.http.get<any>(`${apiUrl}/mdp/productos/listOne/${id}`);
  }
  obtenerProductoPorCodigo(codigo) {
    return this.http.post<any>(`${apiUrl}/mdp/productos/search/producto/codigo/`,codigo);
  }
  crearProducto(datos) {
    return this.http.post<any>(`${apiUrl}/mdp/productos/create/`, datos);
  }
  actualizarProducto(datos, id) {
    return this.http.post<any>(`${apiUrl}/mdp/productos/update/${id}`, datos);
  }
  eliminarProducto(id) {
    return this.http.delete<any>(`${apiUrl}/mdp/productos/delete/${id}`);
  }
  cargarStock(datos) {
    return this.http.post<any>(`${apiUrl}/mdp/productos/upload/excel/`, datos);
  }
  buscarListaProductos(datos) {
    return this.http.post<any>(`${apiUrl}/mdp/productos/search/producto/`, datos);
  }
  obtenerListaRefil(datos) {
    return this.http.post<any>(`${apiUrl}/mdp/productos/refil/list/`, datos);
  }
  obtenerListaAbastecimiento(datos) {
    return this.http.post<any>(`${apiUrl}/mdp/productos/abastecimiento/list/`, datos);
  }
  obtenerListaStock(datos) {
    return this.http.post<any>(`${apiUrl}/mdp/productos/stock/list/`, datos);
  }
  obtenerListaCaducidad(datos) {
    return this.http.post<any>(`${apiUrl}/mdp/productos/caducidad/list/`, datos);
  }
  obtenerListaRotacion(datos) {
    return this.http.post<any>(`${apiUrl}/mdp/productos/rotacion/list/`, datos);
  }
  eliminarImagen(id){
    return this.http.delete<any>(`${apiUrl}/mdp/productos/imagen/delete/${id}`);
  }
  obtenerFichasTecnicas(id) {
    return this.http.get<any>(`${apiUrl}/mdp/fichaTecnicaProductos/list/${id}`);
  }
  obtenerFichaTecnica(id) {
    return this.http.get<any>(`${apiUrl}/mdp/fichaTecnicaProductos/listOne/${id}`);
  }
  crearFichaTecnica(datos) {
    return this.http.post<any>(`${apiUrl}/mdp/fichaTecnicaProductos/create/`, datos);
  }
  editarFichaTecnica(datos) {
    return this.http.post<any>(`${apiUrl}/mdp/fichaTecnicaProductos/update/${datos.id}`, datos);
  }
  eliminarFichaTecnica(id) {
    return this.http.delete<any>(`${apiUrl}/mdp/fichaTecnicaProductos/delete/${id}`);
  }
  
}
