import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
const apiUrl: string = environment.apiUrl;

export interface DatosBasicos {
  tipoCliente;
  created_at;
  cedula;
  telefono;
  nombres;
  apellidos;
  genero;
  correo;
  nacionalidad;
  fechaNacimiento;
  edad;
  paisNacimiento;
  provinciaNacimiento;
  ciudadNacimiento;
  estadoCivil;
  paisResidencia;
  provinciaResidencia;
  ciudadResidencia;
  nivelEstudios;
  profesion;
  lugarTrabajo;
  paisTrabajo;
  provinciaTrabajo;
  ciudadTrabajo;
  ubicacionTrabajo;
  mesesUltimoTrabajo;
  mesesTotalTrabajo;
  ingresosPromedioMensual;
  gastosPromedioMensual;
  estado;
}

export interface DatosFisicos {
  id;
  created_at;
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
  cliente;
}
export interface DatosVirtuales {
  id;
  tipoContacto;
  icono;
  informacion;
  created_at;
  cliente;
}
export interface Transaccion {
  canal;
  cliente;
  correo;
  created_at;
  descuento;
  detalles;
  direccion;
  fecha;
  id;
  identificacion;
  iva;
  nombreVendedor;
  numeroFactura;
  numeroProductosComprados;
  razonSocial;
  subTotal;
  telefono;
  tipoIdentificacion;
  total;
  empresa_id
}
export interface Pariente {
  tipoPariente;
  cedula;
  nombres;
  apellidos;
  fechaMatrimonio;
  lugarMatrimonio;
  genero;
  nacionalidad;
  fechaNacimiento;
  edad;
  paisNacimiento;
  provinciaNacimiento;
  ciudadNacimiento;
  estadoCivil;
  paisResidencia;
  provinciaResidencia;
  ciudadResidencia;
  callePrincipal;
  numero;
  calleSecundaria;
  edificio;
  piso;
  departamento;
  telefonoDomicilio;
  telefonoOficina;
  celularPersonal;
  celularOficina;
  whatsappPersonal;
  whatsappSecundario;
  correoPersonal;
  correoTrabajo;
  googlePlus;
  twitter;
  facebook;
  instagram;
  nivelEstudios;
  profesion;
  lugarTrabajo;
  paisTrabajo;
  provinciaTrabajo;
  ciudadTrabajo;
  mesesUltimoTrabajo;
  mesesTotalTrabajo;
  ingresosPromedioMensual;
  gastosPromedioMensual;
  cliente;
  estado;
}
export interface Detalle {
  id;
  codigo;
  articulo;
  valorUnitario;
  cantidad;
  precio;
  informacionAdicional;
  descuento;
  valorDescuento;
  imagen;
}
@Injectable({
  providedIn: "root",
})
export class ClientesService {
  constructor(private http: HttpClient) {}
  inicializarPariente() {
    let pariente: Pariente = {
      tipoPariente: "",
      cedula: "",
      nombres: "",
      apellidos: "",
      fechaMatrimonio: "",
      lugarMatrimonio: "",
      genero: "",
      nacionalidad: "",
      fechaNacimiento: "",
      edad: 0,
      paisNacimiento: "",
      provinciaNacimiento: "",
      ciudadNacimiento: "",
      estadoCivil: "",
      paisResidencia: "",
      provinciaResidencia: "",
      ciudadResidencia: "",
      callePrincipal: "",
      numero: "",
      calleSecundaria: "",
      edificio: "",
      piso: "",
      departamento: "",
      telefonoDomicilio: "",
      telefonoOficina: "",
      celularPersonal: "",
      celularOficina: "",
      whatsappPersonal: "",
      whatsappSecundario: "",
      correoPersonal: "",
      correoTrabajo: "",
      googlePlus: "",
      twitter: "",
      facebook: "",
      instagram: "",
      nivelEstudios: "",
      profesion: "",
      lugarTrabajo: "",
      paisTrabajo: "",
      provinciaTrabajo: "",
      ciudadTrabajo: "",
      mesesUltimoTrabajo: "",
      mesesTotalTrabajo: "",
      ingresosPromedioMensual: "",
      gastosPromedioMensual: "",
      cliente: "",
      estado: 0,
    };
    return pariente;
  }
  inicializarTransaccion() {
    return {
      canal: "",
      cliente: 0,
      correo: "",
      created_at: "",
      descuento: 0,
      detalles: [],
      direccion: "",
      fecha: "",
      id: "",
      identificacion: "",
      iva: 0,
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
  inicializarDetalle() {
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
      imagen: "",
    };
  }
  obtenerListaClientes(datos) {
    return this.http.post<any>(`${apiUrl}/mdm/clientes/list/`, datos);
  }
  obtenerClientesFiltro() {
    return this.http.get<any>(`${apiUrl}/mdm/clientes/list/`);
  }
  obtenerCliente(id) {
    return this.http.get<any>(`${apiUrl}/mdm/clientes/listOne/${id}`);
  }
  eliminarCliente(id) {
    return this.http.delete<any>(`${apiUrl}/mdm/clientes/delete/${id}`);
  }
  crearDatosBasicos(datos) {
    return this.http.post<any>(`${apiUrl}/mdm/clientes/create/`, datos);
  }
  editarDatosBasicos(id, datos) {
    return this.http.post<any>(`${apiUrl}/mdm/clientes/update/${id}`, datos);
  }
  editarImagen(id, imagen) {
    return this.http.post<any>(
      `${apiUrl}/mdm/clientes/update/imagen/${id}`,
      imagen
    );
  }
  obtenerDatosFisicos(id, datos) {
    return this.http.post<any>(
      `${apiUrl}/mdm/clientes/datos-fisicos-cliente/list/${id}`,
      datos
    );
  }
  obtenerDatoFisico(id) {
    return this.http.get<any>(
      `${apiUrl}/mdm/clientes/datos-fisicos-cliente/findOne/${id}`
    );
  }
  crearDatosFisicos(datos) {
    return this.http.post<any>(
      `${apiUrl}/mdm/clientes/datos-fisicos-cliente/create/`,
      datos
    );
  }
  editarDatosFisicos(datos) {
    return this.http.post<any>(
      `${apiUrl}/mdm/clientes/datos-fisicos-cliente/update/${datos.id}`,
      datos
    );
  }
  eliminarDatosFisicos(id) {
    return this.http.delete<any>(
      `${apiUrl}/mdm/clientes/datos-fisicos-cliente/delete/${id}`
    );
  }
  obtenerDatosVirtuales(id, datos) {
    return this.http.post<any>(
      `${apiUrl}/mdm/clientes/datos-virtuales-cliente/list/${id}`,
      datos
    );
  }
  obtenerDatoVirtual(id) {
    return this.http.get<any>(
      `${apiUrl}/mdm/clientes/datos-virtuales-cliente/findOne/${id}`
    );
  }
  crearDatosVirtuales(datos) {
    return this.http.post<any>(
      `${apiUrl}/mdm/clientes/datos-virtuales-cliente/create/`,
      datos
    );
  }
  editarDatosVirtuales(datos) {
    return this.http.post<any>(
      `${apiUrl}/mdm/clientes/datos-virtuales-cliente/update/${datos.id}`,
      datos
    );
  }
  eliminarDatosVirtuales(id) {
    return this.http.delete<any>(
      `${apiUrl}/mdm/clientes/datos-virtuales-cliente/delete/${id}`
    );
  }
  obtenerTransaccion(id) {
    return this.http.get<any>(`${apiUrl}/mdm/facturas/listOne/${id}`);
  }
  obtenerTodasTrasacciones(datos) {
    return this.http.post<any>(`${apiUrl}/mdm/facturas/list/cliente/`, datos);
  }
  crearTransaccion(datos) {
    return this.http.post<any>(`${apiUrl}/mdm/facturas/create/`, datos);
  }
  obtenerUltimaTransaccion() {
    return this.http.get<any>(`${apiUrl}/mdm/facturas/listLatest/`);
  }
  obtenerTransaccionesCliente(id, datos) {
    return this.http.post<any>(
      `${apiUrl}/mdm/facturas/list/cliente/fecha/${id}`,
      datos
    );
  }
  obtenerGraficaTransaccionesCliente(id, datos) {
    return this.http.post<any>(
      `${apiUrl}/mdm/facturas/list/cliente/fecha/grafica/${id}`,
      datos
    );
  }
  obtenerGraficaTransaccionesGeneral(datos) {
    return this.http.post<any>(
      `${apiUrl}/mdm/facturas/list/cliente/grafica/`,
      datos
    );
  }
  obtenerParientes(id, datos) {
    return this.http.post<any>(
      `${apiUrl}/mdm/clientes/parientes-cliente/list/${id}`,
      datos
    );
  }
  obtenerPariente(id) {
    return this.http.get<any>(
      `${apiUrl}/mdm/clientes/parientes-cliente/findOne/${id}`
    );
  }
  crearPariente(datos) {
    return this.http.post<any>(
      `${apiUrl}/mdm/clientes/parientes-cliente/create/`,
      datos
    );
  }
  actualizarPariente(id, datos) {
    return this.http.post<any>(
      `${apiUrl}/mdm/clientes/parientes-cliente/update/${id}`,
      datos
    );
  }
  eliminarPariente(id) {
    return this.http.delete<any>(
      `${apiUrl}/mdm/clientes/parientes-cliente/delete/${id}`
    );
  }
  obtenerClientePorCedula(cedula) {
    return this.http.post<any>(
      `${apiUrl}/mdm/clientes/listOne/cedula/`,
      cedula
    );
  }
  obtenerClientePorTelefono(telefono) {
    return this.http.post<any>(
      `${apiUrl}/mdm/clientes/listOne/telefono/`,
      telefono
    );
  }

  obtenerProspectoCliente(datos) {
    return this.http.post<any>(
      `${apiUrl}/mdm/prospectosClientes/search/`,
      datos
    );
  }
}
