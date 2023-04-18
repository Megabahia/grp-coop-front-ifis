import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
const apiUrl: string = environment.apiUrl;
export interface DatosBasicos {
  tipoNegocio;
  ruc;
  razonSocial;
  nombreComercial;
  nacionalidad;
  fechaCreacionNegocio;
  edadNegocio;
  paisOrigen;
  paisResidencia;
  provinciaResidencia;
  ciudadResidencia;
  numeroEmpleados;
  segmentoActividadEconomica;
  profesion;
  actividadEconomica;
  llevarContabilidad;
  ingresosPromedioMensual;
  gastosPromedioMensual;
  numeroEstablecimientos;
  telefonoOficina;
  celularOficina;
  celularPersonal;
  whatsappPersonal;
  whatsappSecundario;
  correoPersonal;
  correoOficina;
  googlePlus;
  twitter;
  facebook;
  instagram;
  created_at;
  estado;
}
export interface Personal {
  id;
  negocio;
  tipoContacto;
  cedula;
  nombres;
  apellidos;
  telefonoFijo;
  extension;
  celularEmpresa;
  whatsappEmpresa;
  celularPersonal;
  whatsappPersonal;
  correoEmpresa;
  correoPersonal;
  estado;
  created_at;
}
export interface Direcciones {
  id;
  negocio;
  tipoDireccion;
  pais;
  provincia;
  ciudad;
  callePrincipal;
  numero;
  calleSecundaria;
  edificio;
  piso;
  oficina;
  referencia;
  created_at;
}
export interface Transaccion {
  canal;
  correo;
  created_at;
  descuento;
  detalles;
  direccion;
  fecha;
  id;
  identificacion;
  iva;
  negocio;
  nombreVendedor;
  numeroFactura;
  numeroProductosComprados;
  razonSocial;
  subTotal;
  telefono;
  tipoIdentificacion;
  total;
  empresa_id;
}
export interface Detalle {
  articulo;
  valorUnitario;
  cantidad;
  precio;
  informacionAdicional;
  descuento;
}
@Injectable({
  providedIn: 'root'
})
export class NegociosService {

  constructor(private http: HttpClient) { }
  inicializarDatosBasicos() {
    let datosBasicos = {
      tipoNegocio: "",
      ruc: "",
      razonSocial: "",
      nombreComercial: "",
      nacionalidad: "",
      fechaCreacionNegocio: "",
      edadNegocio: "",
      paisOrigen: "",
      paisResidencia: "",
      provinciaResidencia: "",
      ciudadResidencia: "",
      numeroEmpleados: "",
      segmentoActividadEconomica: "",
      profesion: "",
      actividadEconomica: "",
      llevarContabilidad: "",
      ingresosPromedioMensual:"",
      gastosPromedioMensual: "",
      numeroEstablecimientos: "",
      telefonoOficina: "",
      celularOficina: "",
      celularPersonal: "",
      whatsappPersonal: "",
      whatsappSecundario: "",
      correoPersonal: "",
      correoOficina: "",
      googlePlus: "",
      twitter: "",
      facebook: "",
      instagram: "",
      estado: 0,
      created_at: ""
    }
    return datosBasicos;
  }
  inicializarPersonal() {
    return {
      id: 0,
      negocio: "",
      tipoContacto: "",
      cedula: "",
      nombres: "",
      apellidos: "",
      telefonoFijo: "",
      extension: "",
      celularEmpresa: "",
      whatsappEmpresa: "",
      celularPersonal: "",
      whatsappPersonal: "",
      correoEmpresa: "",
      correoPersonal: "",
      estado: "",
      created_at: ""
    }
  }
  inicializarDireccion() {
    return {
      id: 0,
      negocio: "",
      tipoDireccion: "",
      pais: "",
      provincia: "",
      ciudad: "",
      callePrincipal: "",
      numero: "",
      calleSecundaria: "",
      edificio: "",
      piso: "",
      oficina: "",
      referencia: "",
      created_at: "",
    }
  }
  inicializarTransaccion() {
    return {
      canal: "",
      correo: "",
      created_at: "",
      descuento: 0,
      detalles: [],
      direccion: "",
      fecha: "",
      id: "",
      identificacion: "",
      iva: 0,
      negocio: 0,
      nombreVendedor: "",
      numeroFactura: 0,
      numeroProductosComprados: 0,
      razonSocial: "",
      subTotal: 0,
      telefono: "",
      tipoIdentificacion: "",
      total: 0,
      empresa_id: "",
    };
  }
  inicializarDetalle(){
    return {
      id: 0,
      codigo: "",
      articulo: "",
      valorUnitario: 0,
      cantidad: 0,
      precio: 0,
      informacionAdicional: "",
      descuento: 0,
      valorDescuento: 0,
      imagen: ""
    }
  }
  obtenerListaNegocios(data) {
    return this.http.post<any>(`${apiUrl}/mdm/negocios/list/`, data);
  }
  obtenerNegocio(id){
    return this.http.get<any>(`${apiUrl}/mdm/negocios/listOne/${id}`);
  }
  eliminarNegocio(id){
    return this.http.delete<any>(`${apiUrl}/mdm/negocios/delete/${id}`);
  }
  crearDatosBasicos(datos) {
    return this.http.post<any>(`${apiUrl}/mdm/negocios/create/`, datos);
  }
  editarDatosBasicos(id, datos) {
    return this.http.post<any>(`${apiUrl}/mdm/negocios/update/${id}`, datos);
  }
  obtenerPersonal(id,datos){
    return this.http.post<any>(`${apiUrl}/mdm/negocios/personal/list/${id}`,datos);
  }
  editarImagen(id, imagen) {
    return this.http.post<any>(`${apiUrl}/mdm/negocios/update/imagen/${id}`, imagen);
  }
  crearPersonal(datos) {
    return this.http.post<any>(`${apiUrl}/mdm/negocios/personal/create/`, datos);
  }
  editarPersonal(datos) {
    return this.http.post<any>(`${apiUrl}/mdm/negocios/personal/update/${datos.id}`, datos);
  }
  obtenerUnPersonal(id){
    return this.http.get<any>(`${apiUrl}/mdm/negocios/personal/listOne/${id}`, );
  }
  eliminarPersonal(id){
    return this.http.delete<any>(`${apiUrl}/mdm/negocios/personal/delete/${id}`, );
  }
  obtenerDireccion(id,datos){
    return this.http.post<any>(`${apiUrl}/mdm/negocios/direcciones/list/${id}`,datos);
  }
  crearDireccion(datos) {
    return this.http.post<any>(`${apiUrl}/mdm/negocios/direcciones/create/`, datos);
  }
  editarDireccion(datos) {
    return this.http.post<any>(`${apiUrl}/mdm/negocios/direcciones/update/${datos.id}`, datos);
  }
  obtenerUnaDireccion(id){
    return this.http.get<any>(`${apiUrl}/mdm/negocios/direcciones/listOne/${id}`, );
  }
  eliminarDireccion(id){
    return this.http.delete<any>(`${apiUrl}/mdm/negocios/direcciones/delete/${id}`, );
  }
  obtenerTransaccionesNegocios(id,datos){
    return this.http.post<any>(`${apiUrl}/mdm/facturas/list/negocio/fecha/${id}`,datos);
  }
  obtenerGraficaTransaccionesNegocios(id,datos){
    return this.http.post<any>(`${apiUrl}/mdm/facturas/list/negocio/fecha/grafica/${id}`,datos);
  }
  obtenerTransaccion(id) {
    return this.http.get<any>(`${apiUrl}/mdm/facturas/listOne/${id}`);
  }
  obtenerTodasTrasacciones(datos) {
    return this.http.post<any>(`${apiUrl}/mdm/facturas/list/negocio/`, datos);
  }
  crearTransaccion(datos){
    return this.http.post<any>(`${apiUrl}/mdm/facturas/create/`, datos);
  }
  obtenerUltimaTransaccion(){
    return this.http.get<any>(`${apiUrl}/mdm/facturas/listLatest/`);
  }
  obtenerTransaccionesNegocio(id,datos){
    return this.http.post<any>(`${apiUrl}/mdm/facturas/list/negocio/fecha/${id}`,datos);
  }
  obtenerGraficaTransaccionesNegocio(id,datos){
    return this.http.post<any>(`${apiUrl}/mdm/facturas/list/negocio/fecha/grafica/${id}`,datos);
  }
  obtenerGraficaTransaccionesGeneral(datos){
    return this.http.post<any>(`${apiUrl}/mdm/facturas/list/negocio/grafica/`,datos);
  }
  obtenerNegocioPorRuc(ruc){
    return this.http.post<any>(`${apiUrl}/mdm/negocios/listOne/ruc/`,ruc);
  }
  obtenerNegocioPorTelefono(telefono){
    return this.http.post<any>(`${apiUrl}/mdm/negocios/listOne/telefonoOficina/`,telefono);
  }
}
