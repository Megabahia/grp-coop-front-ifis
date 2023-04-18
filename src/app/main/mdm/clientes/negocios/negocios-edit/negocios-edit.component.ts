import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NegociosService, DatosBasicos, Personal, Direcciones, Transaccion } from '../negocios.service';
import { DatePipe } from '@angular/common';
import { ParamService } from 'app/services/param/param.service';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { NgbPagination, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';

@Component({
  selector: 'app-negocios-edit',
  templateUrl: './negocios-edit.component.html',
  encapsulation: ViewEncapsulation.None,
  host: { class: 'ecommerce-application' },
  providers: [DatePipe]
})
export class NegociosEditComponent implements OnInit {
  @Input() idNegocio;
  @ViewChild(NgbPagination) paginatorPE: NgbPagination;
  @ViewChild(NgbPagination) paginatorDE: NgbPagination;
  @ViewChild('tab1') tab1;
  @ViewChild('tab2') tab2;
  @ViewChild('tab3') tab3;
  @ViewChild('dismissModalDP') dismissModalDP;
  @ViewChild('dismissModalDF') dismissModalDF;
  @ViewChild('mensajeModal') mensajeModal;
  @ViewChild('eliminarPersonalMdl') eliminarPersonalMdl;
  @ViewChild('eliminarDireccionMdl') eliminarDireccionMdl;
  numRegex = /^-?\d*[.,]?\d{0,2}$/;

  //forms
  datosBasicosForm: FormGroup;
  datosPersonalForm: FormGroup;
  datosFisicosForm: FormGroup;
  //------------------------
  //subbmiteds
  submittedDatosBasicosForm = false;
  submittedDatosPersonalForm = false;
  submittedDatosFisicosForm = false;
  //------------------------
  //Mensaje
  mensaje = "";
  //-------------
  //ids
  idPersonal = 0;
  idDireccion = 0;
  //------------------

  public barChartOptions: ChartOptions = {
    responsive: true,
    aspectRatio: 1
  };
  public barChartLabels: Label[] = [

  ];
  public barChartType: ChartType = 'line';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] =
    [];
  public barChartColors: Color[] = [{
    backgroundColor: '#84D0FF'
  }];
  datosTransferencias = {
    data: [], label: 'Series A', fill: false, borderColor: 'rgb(75, 192, 192)',
  }

  vista;

  pageDE = 1;
  pageSizeDE = 10;
  collectionSizeDE;
  pagePE = 1;
  pageSizePE = 10;
  collectionSizePE;
  pageTA = 1;
  pageSizeTA = 10;
  collectionSizeTA;

  fechaInicioTransac = new Date();
  fechaFinTransac = new Date();

  datosBasicos: DatosBasicos;
  datosPersonal: Personal;
  datosDirecciones: Direcciones;

  listaPersonal;
  listaDirecciones;
  listaTransacciones;

  tipoNegocioOpciones;
  nacionalidadOpciones;
  paisesOpciones;
  provinciasResidenciaOpciones;
  ciudadesResidenciaOpciones;
  segmentoActividadEconomicaOpciones;
  actividadEconomicaOpciones;
  profesionOpciones;
  llevarContabilidadOpciones;

  tipoContactoOpciones;

  tipoDireccionOpciones;
  provinciasDireccionOpciones;
  ciudadesDireccionOpciones;

  fechaActual = new Date();

  transaccion: Transaccion;

  estadoOpcion;
  urlImagen;
  constructor(
    private datePipe: DatePipe,
    private negociosService: NegociosService,
    private paramService: ParamService,
    private _formBuilder: FormBuilder,
    private modalService: NgbModal,
    private _coreSidebarService: CoreSidebarService,
  ) {
    this.datosBasicos = negociosService.inicializarDatosBasicos();
    this.datosPersonal = negociosService.inicializarPersonal();
    this.datosDirecciones = negociosService.inicializarDireccion();
    this.datosPersonal.negocio = this.idNegocio;
    this.datosDirecciones.negocio = this.idNegocio;
    this.fechaInicioTransac.setMonth(this.fechaInicioTransac.getMonth() - 3);
    this.transaccion = this.negociosService.inicializarTransaccion();
  }

  //gets
  get dbForm() {
    return this.datosBasicosForm.controls;
  }
  get dpForm() {
    return this.datosPersonalForm.controls;
  }
  get dfForm() {
    return this.datosFisicosForm.controls;
  }
  //------------------
  cambiarTab(seccion) {
    this.vista = seccion;
  }
  ngOnInit(): void {

    this.datosBasicosForm = this._formBuilder.group({
      tipoNegocio: ['', [Validators.required]],
      ruc: ['', [Validators.required]],
      razonSocial: ['', [Validators.required]],
      nombreComercial: ['', [Validators.required]],
      nacionalidad: ['', [Validators.required]],
      fechaCreacionNegocio: ['', [Validators.required]],
      edadNegocio: ['', [Validators.required]],
      paisOrigen: ['', [Validators.required]],
      paisResidencia: ['', [Validators.required]],
      provinciaResidencia: ['', [Validators.required]],
      ciudadResidencia: ['', [Validators.required]],
      numeroEmpleados: [0, [Validators.required]],
      segmentoActividadEconomica: ['', [Validators.required]],
      profesion: ['', [Validators.required]],
      actividadEconomica: ['', [Validators.required]],
      llevarContabilidad: ['', [Validators.required]],
      ingresosPromedioMensual: ['', [Validators.required, Validators.pattern(this.numRegex)]],
      gastosPromedioMensual: ['', [Validators.required, Validators.pattern(this.numRegex)]],
      numeroEstablecimientos: [0, [Validators.required, Validators.pattern("^[0-9]*$")]],
      telefonoOficina: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      celularOficina: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      celularPersonal: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      whatsappPersonal: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      whatsappSecundario: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      correoPersonal: ['', [Validators.required, Validators.email]],
      correoOficina: ['', [Validators.required, Validators.email]],
      googlePlus: ['', [Validators.required, Validators.email]],
      twitter: ['', [Validators.required]],
      facebook: ['', [Validators.required]],
      instagram: ['', [Validators.required]]
    });
    this.datosPersonalForm = this._formBuilder.group({
      tipoContacto: ['', [Validators.required]],
      cedula: [0, [Validators.required, Validators.pattern("^[0-9]*$")]],
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      telefonoFijo: [0, [Validators.required, Validators.pattern("^[0-9]*$")]],
      extension: [0, [Validators.required, Validators.pattern("^[0-9]*$")]],
      celularEmpresa: [0, [Validators.required, Validators.pattern("^[0-9]*$")]],
      whatsappEmpresa: [0, [Validators.required, Validators.pattern("^[0-9]*$")]],
      celularPersonal: [0, [Validators.required, Validators.pattern("^[0-9]*$")]],
      whatsappPersonal: [0, [Validators.required, Validators.pattern("^[0-9]*$")]],
      correoEmpresa: ['', [Validators.required]],
      correoPersonal: ['', [Validators.required]],
      estado: ['', [Validators.required]],
    });
    this.datosFisicosForm = this._formBuilder.group({
      tipoDireccion: ['', [Validators.required]],
      pais: ['', [Validators.required]],
      provincia: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      callePrincipal: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      calleSecundaria: ['', [Validators.required]],
      edificio: ['', [Validators.required]],
      piso: ['', [Validators.required]],
      oficina: ['', [Validators.required]],
      referencia: ['', [Validators.required]],
    });


    this.barChartData = [this.datosTransferencias];
    this.barChartLabels = [
    ]
    this.obtenerActividadEconomicaOpciones();
    this.obtenerNacionalidadOpciones();
    this.obtenerPaisOpciones();
    this.obtenerProfesionOpciones();
    this.obtenerSegmentoActividadEconomicaOpciones();
    this.obtenerTipoContactoNegocioOpciones();
    this.obtenerTipoNegocioOpciones();
    this.obtenerTipoDireccionOpciones();
    if (this.idNegocio == 0) {
      this.datosBasicos.created_at = this.transformarFecha(this.fechaActual);
    } else {
      this.obtenerDatosBasicos();
      this.obtenerPersonalEmpresa();
      this.obtenerDireccionesEmpresa();
      this.obtenerTransacciones();
    }
    this.vista = 'negocio';
  }
  async ngAfterViewInit() {
    this.iniciarPaginador();
  }
  obtenerURLImagen(url) {
    return this.paramService.obtenerURL(url);
  }
  async iniciarPaginador() {
    this.paginatorDE.pageChange.subscribe(() => {
      this.obtenerDireccionesEmpresa();
    });
    this.paginatorPE.pageChange.subscribe(() => {
      this.obtenerPersonalEmpresa();
    });
  }
  async obtenerDatosBasicos() {
    this.negociosService.obtenerNegocio(this.idNegocio).subscribe((info) => {
      this.datosBasicos = info;
      this.estadoOpcion = info.estado == 'Activo' ? 1 : 0;
      this.urlImagen = info.imagen;
      this.datosBasicos.estado = info.estado;
      this.datosBasicos.created_at = this.transformarFecha(info.created_at);
      this.datosBasicos.fechaCreacionNegocio = this.transformarFecha(info.fechaCreacionNegocio);
      this.obtenerProvinciasResidencia();
      this.obtenerCiudadResidencia();
    });
  }
  async guardarImagen(event) {
    let nuevaImagen = event.target.files[0];
    let imagen = new FormData();
    imagen.append('imagen', nuevaImagen, nuevaImagen.name);
    if (this.idNegocio != 0) {
      this.negociosService.editarImagen(this.idNegocio, imagen).subscribe((info) => {
        this.urlImagen = info.imagen;
      });
    }
  }

  obtenerPersonalEmpresa() {
    this.negociosService.obtenerPersonal(this.idNegocio, {
      page: this.pagePE - 1,
      page_size: this.pageSizePE
    }).subscribe((info) => {
      this.listaPersonal = info.info;
      this.collectionSizePE = info.cont;
    });
  }
  obtenerDireccionesEmpresa() {
    this.negociosService.obtenerDireccion(this.idNegocio, {
      page: this.pageDE - 1,
      page_size: this.pageSizeDE
    }).subscribe((info) => {
      this.listaDirecciones = info.info;
      this.collectionSizeDE = info.cont;
    });
  }
  async guardarDatosBasicos() {
    this.submittedDatosBasicosForm = true;

    if (this.datosBasicosForm.invalid) {
      return;
    }
    if (this.idNegocio != 0) {
      this.negociosService.editarDatosBasicos(this.idNegocio, this.datosBasicos).subscribe((info) => {
        this.vista = 'empleados';
      },
      (error) => {
        let errores = Object.values(error);
        let llaves = Object.keys(error);
        this.mensaje = "";
        errores.map((infoErrores, index) => {
          this.mensaje += llaves[index] + ": " + infoErrores + "<br>";
        });
        this.abrirModal(this.mensajeModal);
      });
    } else {
      this.negociosService.crearDatosBasicos(this.datosBasicos).subscribe((info) => {
        this.idNegocio = info.id;
        this.datosPersonal.negocio = this.idNegocio;
        this.datosDirecciones.negocio = this.idNegocio;
        this.vista = 'empleados';
      },
      (error) => {
        let errores = Object.values(error);
        let llaves = Object.keys(error);
        this.mensaje = "";
        errores.map((infoErrores, index) => {
          this.mensaje += llaves[index] + ": " + infoErrores + "<br>";
        });
        this.abrirModal(this.mensajeModal);
      });
    }
  }
  transformarFecha(fecha) {
    let nuevaFecha = this.datePipe.transform(fecha, 'yyyy-MM-dd');
    return nuevaFecha;
  }
  async obtenerTipoNegocioOpciones() {
    await this.paramService.obtenerListaPadres("TIPO_NEGOCIO").subscribe((info) => {
      this.tipoNegocioOpciones = info;
    });
  }
  async obtenerNacionalidadOpciones() {
    await this.paramService.obtenerListaPadres("NACIONALIDAD").subscribe((info) => {
      this.nacionalidadOpciones = info;
    });
  }
  async obtenerPaisOpciones() {
    await this.paramService.obtenerListaPadres("PAIS").subscribe((info) => {
      this.paisesOpciones = info;
    });
  }
  async obtenerProvinciasResidencia() {
    await this.paramService.obtenerListaHijos(this.datosBasicos.paisResidencia, "PAIS").subscribe((info) => {
      this.provinciasResidenciaOpciones = info;
    });
  }
  async obtenerCiudadResidencia() {
    await this.paramService.obtenerListaHijos(this.datosBasicos.provinciaResidencia, "PROVINCIA").subscribe((info) => {
      this.ciudadesResidenciaOpciones = info;
    });
  }
  async obtenerSegmentoActividadEconomicaOpciones() {
    await this.paramService.obtenerListaPadres("SEGMENTO_ACTIVIDAD_ECONOMICA").subscribe((info) => {
      this.segmentoActividadEconomicaOpciones = info;
    });
  }
  async obtenerProfesionOpciones() {
    await this.paramService.obtenerListaPadres("PROFESION").subscribe((info) => {
      this.profesionOpciones = info;
    });
  }
  async obtenerActividadEconomicaOpciones() {
    await this.paramService.obtenerListaPadres("ACTIVIDAD_ECONOMICA").subscribe((info) => {
      this.actividadEconomicaOpciones = info;
    });
  }
  async obtenerTipoContactoNegocioOpciones() {
    await this.paramService.obtenerListaPadres("TIPO_CONTACTO_NEGOCIO").subscribe((info) => {
      this.tipoContactoOpciones = info;
    });
  }
  async obtenerTipoDireccionOpciones() {
    await this.paramService.obtenerListaPadres("TIPO_DIRECCION").subscribe((info) => {
      this.tipoDireccionOpciones = info;
    });
  }
  async obtenerProvinciasDirecciones() {
    await this.paramService.obtenerListaHijos(this.datosDirecciones.pais, "PAIS").subscribe((info) => {
      this.provinciasDireccionOpciones = info;
    });
  }
  async obtenerCiudadDirecciones() {
    await this.paramService.obtenerListaHijos(this.datosDirecciones.provincia, "PROVINCIA").subscribe((info) => {
      this.ciudadesDireccionOpciones = info;
    });
  }
  async calcularEdadNegocio() {
    this.datosBasicos.edadNegocio = moment().diff(this.datosBasicos.fechaCreacionNegocio, 'years');
  }
  async cambiarEstado() {
    this.datosBasicos.estado = this.estadoOpcion == 1 ? 'Activo' : 'Inactivo'
  }
  crearPersonal(name?) {
    this.datosPersonal = this.negociosService.inicializarPersonal();
    this.datosPersonal.created_at = this.transformarFecha(this.fechaActual);
    this.datosPersonal.negocio = this.idNegocio;
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }
  async editarPersonal(id) {
    await this.negociosService.obtenerUnPersonal(id).subscribe((info) => {
      this.datosPersonal = info;
    });
    this._coreSidebarService.getSidebarRegistry('addempleado').toggleOpen();
  }
  async eliminarPersonalModal(id) {
    this.idPersonal = id;
    this.abrirModal(this.eliminarPersonalMdl);
  }
  eliminarPersonal() {
    this.negociosService.eliminarPersonal(this.idPersonal).subscribe(() => {
      this.obtenerPersonalEmpresa();
      this.cerrarModal();
    });
  }

  async eliminarDireccionModal(id) {
    this.idDireccion = id;
    this.abrirModal(this.eliminarDireccionMdl);
  }
  eliminarDireccion() {
    this.negociosService.eliminarDireccion(this.idDireccion).subscribe(() => {
      this.obtenerDireccionesEmpresa();
      this.cerrarModal();
    });
  }
  async guardarPersonal() {
    this.submittedDatosPersonalForm = true;

    if (this.datosPersonalForm.invalid) {
      return;
    }
    if (this.idNegocio != 0) {
      if (this.datosPersonal.id == 0) {
        await this.negociosService.crearPersonal(this.datosPersonal).subscribe((info) => {
          this.dismissModalDP.nativeElement.click();
          this.obtenerPersonalEmpresa();
        },
          (error) => {
            let errores = Object.values(error);
            let llaves = Object.keys(error);
            this.mensaje = "";
            errores.map((infoErrores, index) => {
              this.mensaje += llaves[index] + ": " + infoErrores + "<br>";
            });
            this.abrirModal(this.mensajeModal);
          });
      } else {
        await this.negociosService.editarPersonal(this.datosPersonal).subscribe((info) => {
          this.dismissModalDP.nativeElement.click();
          this.obtenerPersonalEmpresa();
        },
        (error) => {
          let errores = Object.values(error);
          let llaves = Object.keys(error);
          this.mensaje = "";
          errores.map((infoErrores, index) => {
            this.mensaje += llaves[index] + ": " + infoErrores + "<br>";
          });
          this.abrirModal(this.mensajeModal);
        });
      }
    } else {
      this.mensaje = "Es necesario que primero ingrese sus datos básicos"
      this.abrirModal(this.mensajeModal);
    }

  }
  crearDireccion(name?) {
    this.datosDirecciones = this.negociosService.inicializarDireccion();
    this.datosDirecciones.created_at = this.transformarFecha(this.fechaActual);
    this.datosDirecciones.negocio = this.idNegocio;
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }
  async editarDireccion(id) {
    await this.negociosService.obtenerUnaDireccion(id).subscribe((info) => {
      this.datosDirecciones = info;
      this.datosDirecciones.created_at = this.transformarFecha(info.created_at);
      this.obtenerProvinciasDirecciones();
      this.obtenerCiudadDirecciones();
    });
    this._coreSidebarService.getSidebarRegistry('addfisico').toggleOpen();
  }
 

  async guardarDireccion() {
    this.submittedDatosFisicosForm = true;

    if (this.datosFisicosForm.invalid) {
      return;
    }
    if(this.idNegocio !=0){
      if (this.datosDirecciones.id == 0) {
        await this.negociosService.crearDireccion(this.datosDirecciones).subscribe((info) => {
          this.dismissModalDF.nativeElement.click();
  
          this.obtenerDireccionesEmpresa();
        },(error) => {
          let errores = Object.values(error);
          let llaves = Object.keys(error);
          this.mensaje = "";
          errores.map((infoErrores, index) => {
            this.mensaje += llaves[index] + ": " + infoErrores + "<br>";
          });
          this.abrirModal(this.mensajeModal);
        });
      } else {
        await this.negociosService.editarDireccion(this.datosDirecciones).subscribe((info) => {
          this.dismissModalDF.nativeElement.click();
          this.obtenerDireccionesEmpresa();
        },
        (error) => {
          let errores = Object.values(error);
          let llaves = Object.keys(error);
          this.mensaje = "";
          errores.map((infoErrores, index) => {
            this.mensaje += llaves[index] + ": " + infoErrores + "<br>";
          });
          this.abrirModal(this.mensajeModal);
        });
      }
    }else{
      this.mensaje = "Es necesario que primero ingrese sus datos básicos"
      this.abrirModal(this.mensajeModal);
    }
    
  }

  obtenerTransacciones() {
    this.negociosService.obtenerTransaccionesNegocios(this.idNegocio,
      {
        page: this.pageTA - 1,
        page_size: this.pageSizeTA,
        inicio: this.fechaInicioTransac,
        fin: this.fechaFinTransac
      }).subscribe((info) => {
        this.collectionSizeTA = info.cont;
        this.listaTransacciones = info.info;
        this.obtenerGraficos();
      });
  }

  async obtenerGraficos() {
    this.negociosService.obtenerGraficaTransaccionesNegocios(this.idNegocio, {
      page: this.pageTA - 1,
      page_size: this.pageSizeTA,
      inicio: this.fechaInicioTransac,
      fin: this.fechaFinTransac
    }
    ).subscribe((info) => {
      let etiquetas = [];
      let valores = [];

      info.map((datos) => {
        etiquetas.push(datos.anio + "-" + datos.mes);
        valores.push(datos.cantidad);
      });
      this.datosTransferencias = {
        data: valores, label: 'Series A', fill: false, borderColor: 'rgb(75, 192, 192)'
      }
      this.barChartData = [this.datosTransferencias];
      this.barChartLabels = etiquetas;
    });
  }
  async obtenerTransaccion(id) {
    this.negociosService.obtenerTransaccion(id).subscribe((info) => {
      this.transaccion = info;
      this.transaccion.created_at = this.transformarFecha(info.created_at);
    });
  }
  abrirModal(modal) {
    this.modalService.open(modal)
  }
  cerrarModal() {
    this.modalService.dismissAll();
  }
  cerrarModalCore(name) {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }
}
