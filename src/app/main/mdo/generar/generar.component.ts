import { Component, OnInit, ViewChild } from "@angular/core";
import { NgbPagination, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DatePipe } from "@angular/common";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Detalles, GenerarService, Oferta } from "./generar.service";
import { ParamService } from "app/services/param/param.service";
import { ExportService } from "app/services/export/export.service";
import { ClientesService } from "app/main/mdm/clientes/personas/clientes.service";
import { NegociosService } from "app/main/mdm/clientes/negocios/negocios.service";
import { ProductosService } from "app/main/mdp/productos/productos.service";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";

@Component({
  selector: "app-generar",
  templateUrl: "./generar.component.html",
  styleUrls: ["./generar.component.scss"],
  providers: [DatePipe],
})
export class GenerarComponent implements OnInit {
  @ViewChild(NgbPagination) paginator: NgbPagination;
  @ViewChild("ofertaGuardar") ofertaGuardar;
  @ViewChild("mensajeModal") mensajeModal;
  public usuario;

  mensaje = "";
  numRegex = /^-?\d*[.,]?\d{0,2}$/;

  //forms
  ofertaForm: FormGroup;

  //----------------------
  submittedTransaccionForm = false;

  menu;
  page = 1;
  pageSize: any = 10;
  maxSize;
  collectionSize;
  fecha = "";
  inicio = "";
  fin = "";
  ultimosProductos;
  prediccion;
  cliente;
  tipoCliente = "";
  tipoClienteModal = "";
  identificacion;
  infoExportar = [];
  listaOfertas;

  fechaActual = new Date();
  identificacionOfertaBusq;
  telefonoOfertaBusq;
  oferta: Oferta;
  tipoClienteOferta = "";
  iva;
  comprobarProductos: Boolean[];
  checkProductos = true;
  habilitarIdentificacion;
  habilitarTelefono;
  habalitarBusqueda;

  detallesForm;
  detalles: Detalles[] = [];
  detallesTransac;
  public isCollapsed = [];
  listaPrecios = [];
  precios = [];
  tipoCanalOpciones;

  ofertaId;
  vista: string = "";
  idCliente: number;

  constructor(
    private _formBuilder: FormBuilder,
    private generarService: GenerarService,
    private datePipe: DatePipe,
    private paramService: ParamService,
    private exportFile: ExportService,
    private clientesService: ClientesService,
    private negociosService: NegociosService,
    private productosService: ProductosService,
    private modalService: NgbModal,
    private _coreSidebarService: CoreSidebarService
  ) {
    this.oferta = this.generarService.inicializarOferta();
    this.comprobarProductos = [];
    this.usuario = JSON.parse(localStorage.getItem("grpIfisUser"));
  }

  ngOnInit(): void {
    this.ofertaForm = this._formBuilder.group({
      detalles: this._formBuilder.array([this.crearDetalleGrupo()]),
      fecha: ["", [Validators.required]],
      nombres: ["", [Validators.required]],
      apellidos: ["", [Validators.required]],
      identificacion: [
        "",
        [Validators.required, Validators.pattern("^[0-9]*$")],
      ],
      telefono: ["", [Validators.required]],
      correo: ["", [Validators.required]],
      vigenciaOferta: [0, [Validators.required]],
      canal: ["", [Validators.required]],
      personaGenera: ["", [Validators.required]],
      descripcion: ["", [Validators.required]],
      direccion: ["", [Validators.required]],
    });
    this.menu = {
      modulo: "mdo",
      seccion: "genOferta",
    };
    this.obtenerTipoIdentificacionOpciones();
    this.obtenerIVA();
    this.agregarPrecios();
  }
  get oForm() {
    return this.ofertaForm.controls;
  }
  inicializarDetallesOferta() {
    this.detalles = [];
    this.detalles.push(this.generarService.inicializarDetalle());
    this.listaPrecios.push(this.generarService.inicializarPrecios());
  }
  async ngAfterViewInit() {
    this.iniciarPaginador();
    this.obtenerListaOfertas();
  }
  async iniciarPaginador() {
    this.paginator.pageChange.subscribe(() => {
      this.obtenerListaOfertas();
    });
  }
  obtenerListaOfertas() {
    let fecha = this.fecha.split(" to ");
    this.inicio = fecha[0] ? fecha[0] : "";
    this.fin = fecha[1] ? fecha[1] : "";
    let busqueda: any = {
      page: this.page - 1,
      page_size: this.pageSize,
      inicio: this.inicio,
      fin: this.fin,
    };
    if (this.tipoCliente == "negocio") {
      busqueda = {
        ...busqueda,
        negocio: 1,
        identificacion: this.identificacion,
      };
    } else if (this.tipoCliente == "cliente") {
      busqueda = {
        ...busqueda,
        cliente: 1,
        identificacion: this.identificacion,
      };
    }
    this.generarService.obtenerListaOfertas(busqueda).subscribe((info) => {
      this.listaOfertas = info.info;
      this.collectionSize = info.cont;
    });
  }
  transformarFecha(fecha) {
    let nuevaFecha = this.datePipe.transform(fecha, "yyyy-MM-dd");
    return nuevaFecha;
  }
  obtenerURLImagen(url) {
    return this.paramService.obtenerURL(url);
  }
  crearDetalleGrupo() {
    return this._formBuilder.group({
      codigo: ["", [Validators.required]],
      articulo: ["", [Validators.required]],
      valorUnitario: [0, [Validators.required, Validators.min(1)]],
      cantidad: [
        0,
        [
          Validators.required,
          Validators.pattern("^[0-9]*$"),
          Validators.min(1),
        ],
      ],
      informacionAdicional: ["", [Validators.required]],
      descuento: [0, [Validators.required, Validators.pattern(this.numRegex)]],
      valorDescuento: [0, [Validators.required]],
    });
  }
  get detallesArray(): FormArray {
    return this.ofertaForm.get("detalles") as FormArray;
  }
  crearDetalle() {
    return this._formBuilder.group(this.generarService.inicializarDetalle());
  }
  agregarItem(): void {
    this.detalles.push(this.generarService.inicializarDetalle());
    this.agregarPrecios();
    let detGrupo = this.crearDetalleGrupo();
    this.comprobarProductos.push(false);
    this.detallesArray.push(detGrupo);
  }
  agregarPrecios() {
    this.listaPrecios.push(this.generarService.inicializarPrecios());
  }
  removerItem(i): void {
    this.detalles.splice(i, 1);
    this.listaPrecios.splice(i, 1);
    this.detallesArray.removeAt(i);

    this.comprobarProductos.splice(i, 1);

    this.calcularSubtotal();
  }

  calcularSubtotal() {
    let detalles = this.detalles;
    let subtotal = 0;
    let descuento = 0;
    let cantidad = 0;
    if (detalles) {
      detalles.map((valor) => {
        let valorUnitario = Number(valor.valorUnitario)
          ? Number(valor.valorUnitario)
          : 0;
        let porcentDescuento = valor.descuento ? valor.descuento : 0;
        let cantidadProducto = valor.cantidad ? valor.cantidad : 0;
        let precio = cantidadProducto * valorUnitario;

        valor.valorDescuento = this.redondeoValor(
          precio * (porcentDescuento / 100)
        );
        descuento += precio * (porcentDescuento / 100);
        subtotal += precio;
        cantidad += valor.cantidad ? valor.cantidad : 0;
        valor.precio = this.redondear(precio);
      });
    }

    this.oferta.numeroProductosComprados = cantidad;
    this.detallesTransac = detalles;
    this.oferta.subTotal = this.redondear(subtotal);
    this.oferta.iva = this.redondear((subtotal - descuento) * this.iva.valor);
    this.oferta.descuento = this.redondear(descuento);
    this.oferta.total = this.redondear(subtotal - descuento + this.oferta.iva);
  }
  redondear(num, decimales = 2) {
    var signo = num >= 0 ? 1 : -1;
    num = num * signo;
    if (decimales === 0)
      //con 0 decimales
      return signo * Math.round(num);
    // round(x * 10 ^ decimales)
    num = num.toString().split("e");
    num = Math.round(
      +(num[0] + "e" + (num[1] ? +num[1] + decimales : decimales))
    );
    // x * 10 ^ (-decimales)
    num = num.toString().split("e");
    let valor =
      signo *
      Number(num[0] + "e" + (num[1] ? +num[1] - decimales : -decimales));
    return valor;
  }
  redondeoValor(valor) {
    return isNaN(valor) ? valor : parseFloat(valor).toFixed(2);
  }
  verificarBusqueda() {
    if (!this.identificacionOfertaBusq && !this.telefonoOfertaBusq) {
      this.habilitarIdentificacion = false;
      this.habilitarTelefono = false;
    } else if (this.identificacionOfertaBusq) {
      this.habilitarIdentificacion = false;
      this.habilitarTelefono = true;
    } else if (this.telefonoOfertaBusq) {
      this.habilitarIdentificacion = true;
      this.habilitarTelefono = false;
    }
  }
  obtenerCliente() {
    if (this.identificacionOfertaBusq) {
      if (this.tipoClienteOferta == "cliente") {
        this.clientesService
          .obtenerClientePorCedula({ cedula: this.identificacionOfertaBusq })
          .subscribe(
            (info) => {
              if (info) {
                this.oferta.nombres = info.nombres;
                this.oferta.apellidos = info.apellidos;
                this.oferta.identificacion = info.cedula;
                this.oferta.telefono = info.telefono;
                this.oferta.correo = info.correo;
                this.oferta.cliente = info.id;
                this.oferta.negocio = null;
                this.oferta.indicadorCliente = "C-" + info.id;
              }
            },
            (error) => {
              if (error.error == "No existe") {
                this.mensaje = "Cliente no existe";
                this.abrirModalMensaje(this.mensajeModal);
              }
            }
          );
      } else if (this.tipoClienteOferta == "negocio") {
        this.negociosService
          .obtenerNegocioPorRuc({ ruc: this.identificacionOfertaBusq })
          .subscribe(
            (info) => {
              if (info) {
                this.oferta.nombres = info.razonSocial;
                this.oferta.apellidos = info.nombreComercial;
                this.oferta.identificacion = info.ruc;
                this.oferta.telefono = info.telefonoOficina;
                this.oferta.correo = info.correoOficina;
                this.oferta.negocio = info.id;
                this.oferta.cliente = null;
                this.oferta.indicadorCliente = "N-" + info.id;
              }
            },
            (error) => {
              if (error.error == "No existe") {
                this.mensaje = "Negocio no existe";
                this.abrirModalMensaje(this.mensajeModal);
              }
            }
          );
      } else {
        this.mensaje = "Es necesario seleccionar un tipo de cliente";
        this.abrirModalMensaje(this.mensajeModal);
      }
    } else if (this.telefonoOfertaBusq) {
      if (this.tipoClienteOferta == "cliente") {
        this.clientesService
          .obtenerClientePorTelefono({ telefono: this.telefonoOfertaBusq })
          .subscribe(
            (info) => {
              if (info) {
                this.oferta.nombres = info.nombres;
                this.oferta.apellidos = info.apellidos;
                this.oferta.identificacion = info.cedula;
                this.oferta.telefono = info.telefono;
                this.oferta.correo = info.correo;
                this.oferta.cliente = info.id;
                this.oferta.negocio = null;
                this.oferta.indicadorCliente = "C-" + info.id;
              }
            },
            (error) => {
              if (error.error == "No existe") {
                this.mensaje = "Cliente no existe";
                this.abrirModalMensaje(this.mensajeModal);
              }
            }
          );
      } else if (this.tipoClienteOferta == "negocio") {
        this.negociosService
          .obtenerNegocioPorTelefono({
            telefonoOficina: this.telefonoOfertaBusq,
          })
          .subscribe(
            (info) => {
              if (info) {
                this.oferta.nombres = info.razonSocial;
                this.oferta.apellidos = info.nombreComercial;
                this.oferta.identificacion = info.ruc;
                this.oferta.telefono = info.telefonoOficina;
                this.oferta.correo = info.correoOficina;
                this.oferta.negocio = info.id;
                this.oferta.cliente = null;
                this.oferta.indicadorCliente = "N-" + info.id;
              }
            },
            (error) => {
              if (error.error == "No existe") {
                this.mensaje = "Negocio no existe";
                this.abrirModalMensaje(this.mensajeModal);
              }
            }
          );
      } else {
        this.mensaje = "Es necesario seleccionar un tipo de cliente";
        this.abrirModalMensaje(this.mensajeModal);
      }
    } else {
      this.mensaje = "No se ha ingresado ningun valor";
      this.abrirModalMensaje(this.mensajeModal);
    }
  }

  crearOferta() {
    if (!this.iva) {
      this.mensaje =
        "Error en la obtención del iva, verifique su configuración";
      this.abrirModalMensaje(this.mensajeModal);
    }

    this.checkProductos = true;
    this.oferta = this.generarService.inicializarOferta();
    this.oferta.personaGenera =
      this.usuario.persona.nombres + " " + this.usuario.persona.apellidos;
    this.oferta.nombreVendedor =
      this.usuario.persona.nombres + " " + this.usuario.persona.apellidos;
    this.oferta.created_at = this.transformarFecha(this.fechaActual);
    this.oferta.fecha = this.transformarFecha(this.fechaActual);
    this.inicializarDetallesOferta();
    this.listaPrecios = [];
    this.agregarPrecios();
  }

  async obtenerIVA() {
    await this.paramService
      .obtenerParametroNombreTipo("ACTIVO", "TIPO_IVA")
      .subscribe(
        (info) => {
          this.iva = info;
        },
        (error) => {
          this.mensaje =
            "Error en la obtención del iva, verifique su configuración";
          this.abrirModalMensaje(this.mensajeModal);
        }
      );
  }
  async guardarOferta() {
    if (!this.iva) {
      this.mensaje =
        "Error en la obtención del iva, verifique su configuración";
      this.abrirModalMensaje(this.mensajeModal);
      return;
    }
    this.submittedTransaccionForm = true;
    console.log(this.ofertaForm);

    this.comprobarProductos.map((compProd) => {
      if (!compProd) {
        this.checkProductos = false;
        return;
      }
    });

    if (!this.oferta.cliente && !this.oferta.negocio) {
      this.mensaje = "Es necesario asignar al cliente o negocio";
      this.abrirModalMensaje(this.mensajeModal);
      return;
    }
    if (!this.checkProductos) {
      this.mensaje = "No se han ingresado productos correctamente";
      this.abrirModalMensaje(this.mensajeModal);
      return;
    }
    if (this.detalles.length == 0) {
      this.mensaje = "No se han ingresado productos";
      this.abrirModalMensaje(this.mensajeModal);
      return;
    }
    if (this.ofertaForm.invalid) {
      return;
    }
    this.calcularSubtotal();
    this.oferta.fecha = this.transformarFecha(this.fechaActual);
    this.oferta.detalles = this.detallesTransac;
    if (this.oferta.id == 0) {
      await this.generarService.crearOferta(this.oferta).subscribe(
        (info) => {
          this.obtenerListaOfertas();
          this.mensaje = "Oferta creada con éxito";
          this.abrirModalMensaje(this.mensajeModal);
          this.ofertaGuardar.nativeElement.click();
        },
        (error) => {
          let errores = Object.values(error);
          let llaves = Object.keys(error);
          this.mensaje = "";
          errores.map((infoErrores, index) => {
            this.mensaje += llaves[index] + ": " + infoErrores + "<br>";
          });
          this.abrirModalMensaje(this.mensajeModal);
          this.ofertaGuardar.nativeElement.click();
        }
      );
    } else {
      await this.generarService.actualizarOferta(this.oferta).subscribe(
        (info) => {
          this.obtenerListaOfertas();
          this.mensaje = "Oferta actualizada con éxito";
          this.abrirModalMensaje(this.mensajeModal);
          this.ofertaGuardar.nativeElement.click();
        },
        (error) => {
          let errores = Object.values(error);
          let llaves = Object.keys(error);
          this.mensaje = "";
          errores.map((infoErrores, index) => {
            this.mensaje += llaves[index] + ": " + infoErrores + "<br>";
          });
          this.abrirModalMensaje(this.mensajeModal);
        }
      );
    }
  }
  obtenerProducto(i) {
    this.productosService
      .obtenerProductoPorCodigo({
        codigoBarras: this.detalles[i].codigo,
      })
      .subscribe((info) => {
        if (info.codigoBarras) {
          this.comprobarProductos[i] = true;

          this.detalles[i].articulo = info.nombre;
          this.detalles[i].imagen = this.obtenerURLImagen(info.imagen);
          this.listaPrecios[i].precioVentaA = info.precioVentaA;
          this.listaPrecios[i].precioVentaB = info.precioVentaB;
          this.listaPrecios[i].precioVentaC = info.precioVentaC;
          this.listaPrecios[i].precioVentaD = info.precioVentaD;
          this.listaPrecios[i].precioVentaE = info.precioVentaE;
        } else {
          this.comprobarProductos[i] = false;
          this.mensaje = "No existe el producto a buscar";
          this.abrirModalMensaje(this.mensajeModal);
        }
      });
  }
  async obtenerTipoIdentificacionOpciones() {
    await this.paramService.obtenerListaPadres("CANAL").subscribe((info) => {
      this.tipoCanalOpciones = info;
    });
  }
  obtenerUltimosProductos(id) {
    this.generarService.obtenerProductosAdquiridos(id).subscribe((info) => {
      info.map((prod) => {
        prod.imagen = this.obtenerURLImagen(prod.imagen);
      });
      this.ultimosProductos = info;
    });
  }
  obtenerOferta(id) {
    this.generarService.obtenerOferta(id).subscribe((info) => {
      this.oferta = info;
      this.oferta.nombreVendedor = info.nombreVendedor;
      this.oferta.personaGenera = info.nombreVendedor;
      this.detalles = info.detalles;
      this.checkProductos = true;

      this.listaPrecios = [];
      for (let i = 0; i < info.detalles.length; i++) {
        this.listaPrecios.push(this.generarService.inicializarPrecios());
        this.obtenerProducto(i);
      }
    });
  }

  abrirModal(modal, id) {
    this.ofertaId = id;
    this.modalService.open(modal);
  }
  abrirModalMensaje(modal) {
    this.modalService.open(modal);
  }
  cerrarModalMensaje() {
    this.modalService.dismissAll();
  }
  cerrarModal() {
    this.modalService.dismissAll();
    this.generarService.eliminarOferta(this.ofertaId).subscribe(() => {
      this.obtenerListaOfertas();
    });
  }
  cerrarModalCore(name) {
    this.generarService.eliminarOferta(this.ofertaId).subscribe(() => {
      this.obtenerListaOfertas();
    });
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  crearOfertaN(name?) {
    this.vista = "editar";
    this.idCliente = 0;
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }
}
