import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NegociosService, Transaccion } from '../negocios.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ParamService } from 'app/services/param/param.service';
import { ProductosService } from 'app/main/mdp/productos/productos.service';
@Component({
  selector: 'app-transacciones-add',
  templateUrl: './transacciones-add.component.html',
  styleUrls: ['./transacciones-add.component.scss'],
  providers: [DatePipe]
})
export class TransaccionesAddComponent implements OnInit {
  @ViewChild('mensajeModal') mensajeModal;
  public usuario;
  menu;
  transaccion: Transaccion;
  detallesForm;
  mensaje = "";

  // detalles: FormArray;
  detalles = [];
  detallesTransac;
  numRegex = /^-?\d*[.,]?\d{0,2}$/;
  //forms
  transaccionForm: FormGroup;
  comprobarProductos: Boolean[];
  //----------------
  submittedTransaccionForm = false;

  public isCollapsed = [];
  tipoIdentificacionOpciones;
  iva;
  ultimaFactura = 0;
  fechaActual = new Date();
  canalOpciones;
  constructor(
    private _formBuilder: FormBuilder,
    private negociosService: NegociosService,
    private paramService: ParamService,
    private datePipe: DatePipe,
    private productosService: ProductosService,
    private modalService: NgbModal

  ) {
    this.transaccion = negociosService.inicializarTransaccion();
    this.iva = {
      created_at: "",
      descripcion: "",
      id: 0,
      idPadre: 0,
      nombre: "",
      state: 0,
      tipo: "",
      tipoVariable: "",
      updated_at: "",
      valor: ""
    };
    this.transaccion.fecha = this.transformarFecha(this.fechaActual);
    this.comprobarProductos = [];
    this.usuario = JSON.parse(localStorage.getItem('grpIfisUser'));

  }

  ngOnInit(): void {

    this.transaccionForm = this._formBuilder.group({
      canal: ['', [Validators.required]],
      correo: ['', [Validators.required]],
      detalles: this._formBuilder.array([
        this.crearDetalleGrupo()
      ]),
      direccion: ['', [Validators.required]],
      fecha: ['', [Validators.required]],
      identificacion: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      nombreVendedor: ['', [Validators.required]],
      razonSocial: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      tipoIdentificacion: ['', [Validators.required]],
    });
    this.menu = {
      modulo: "mdm",
      seccion: "negociosTransacAdd"
    };
    this.transaccion.nombreVendedor = this.usuario.persona.nombres + " " + this.usuario.persona.apellidos;
    this.obtenerTipoIdentificacionOpciones();
    this.obtenerIVA();
    this.obternerUltimaTransaccion();
    this.obtenerCanales();
    this.inicializarDetalles();
  }

  crearDetalleGrupo() {
    return this._formBuilder.group({
      codigo: ['', [Validators.required]],
      articulo: ['', [Validators.required]],
      valorUnitario: [0, [Validators.required]],
      cantidad: [0, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.min(1)]],
      precio: [0, [Validators.required]],
      informacionAdicional: ['', [Validators.required]],
      descuento: [0, [Validators.required, Validators.pattern(this.numRegex)]],
      valorDescuento: [0, [Validators.required]]
    });
  }

  inicializarDetalles() {
    this.detalles = [];
    this.detalles.push(this.negociosService.inicializarDetalle());
  }
  transformarFecha(fecha) {
    let nuevaFecha = this.datePipe.transform(fecha, 'yyyy-MM-dd');
    return nuevaFecha;
  }

  get detallesArray(): FormArray {
    return this.transaccionForm.get('detalles') as FormArray;
  }
  get tForm() {
    return this.transaccionForm.controls;
  }
  agregarItem(): void {
    this.detalles.push(this.negociosService.inicializarDetalle());
    let detGrupo = this.crearDetalleGrupo();
    this.detallesArray.push(detGrupo);
    this.comprobarProductos.push(false);
  }
  removerItem(i): void {
    this.detalles.splice(i, 1);
    this.calcularSubtotal();
    this.detallesArray.removeAt(i);
    this.comprobarProductos.splice(i, 1);
    // this.isCollapsed.splice(i, 1);
    // this.detalles.removeAt(i);
  }
  obtenerProducto(i) {
    this.productosService.obtenerProductoPorCodigo({
      codigoBarras: this.detalles[i].codigo
    }).subscribe((info) => {
      if (info.codigoBarras) {
        this.comprobarProductos[i] = true;
        this.detalles[i].articulo = info.nombre;
        this.detalles[i].imagen = info.imagen;
        this.detalles[i].valorUnitario = info.precioVentaA;
      } else {
        this.comprobarProductos[i] = false;
        this.mensaje = "No existe el producto a buscar";
        this.abrirModal(this.mensajeModal);
      }
    }, (error) => {

    });
  }
  calcularSubtotal() {
    let detalles = this.detalles;
    let subtotal = 0;
    let descuento = 0;
    let cantidad = 0;
    if (detalles) {
      detalles.map((valor) => {
        let valorUnitario = Number(valor.valorUnitario) ? Number(valor.valorUnitario) : 0;
        let porcentDescuento = valor.descuento ? valor.descuento : 0;
        let cantidadProducto = valor.cantidad ? valor.cantidad : 0;
        let precio = cantidadProducto * valorUnitario;

        valor.valorDescuento = this.redondeoValor(precio * (porcentDescuento / 100));
        descuento += precio * (porcentDescuento / 100);
        subtotal += precio;
        cantidad += valor.cantidad ? valor.cantidad : 0;
        valor.precio = this.redondear(precio);
        valor.total = valor.precio;
      });
    }

    this.transaccion.numeroProductosComprados = cantidad;
    this.detallesTransac = detalles;
    this.transaccion.subTotal = this.redondear(subtotal);
    this.transaccion.iva = this.redondear((subtotal - descuento) * this.iva.valor);
    this.transaccion.descuento = this.redondear(descuento);
    this.transaccion.total = this.redondear((subtotal - descuento) + this.transaccion.iva);
  }
  redondear(num, decimales = 2) {
    var signo = (num >= 0 ? 1 : -1);
    num = num * signo;
    if (decimales === 0) //con 0 decimales
      return signo * Math.round(num);
    // round(x * 10 ^ decimales)
    num = num.toString().split('e');
    num = Math.round(+(num[0] + 'e' + (num[1] ? (+num[1] + decimales) : decimales)));
    // x * 10 ^ (-decimales)
    num = num.toString().split('e');
    let valor = signo * (Number)(num[0] + 'e' + (num[1] ? (+num[1] - decimales) : -decimales));
    return valor;
  }
  redondeoValor(valor) {
    return isNaN(valor) ? valor : parseFloat(valor).toFixed(2);
  }
  async obtenerTipoIdentificacionOpciones() {
    await this.paramService.obtenerListaPadres("TIPO_IDENTIFICACION").subscribe((info) => {
      this.tipoIdentificacionOpciones = info;
    });
  }
  async obtenerIVA() {
    await this.paramService.obtenerParametroNombreTipo("ACTIVO", "TIPO_IVA").subscribe((info) => {
      this.iva = info;
    },
      (error) => {
        this.mensaje = "Iva no configurado";
        this.abrirModal(this.mensajeModal);
      }
    );
  }
  async guardarTransaccion() {
    this.submittedTransaccionForm = true;
    if (!this.iva) {
      this.mensaje = "El iva debe ser configurado";
      this.abrirModal(this.mensajeModal);
      return;
    }
    if (!this.transaccion.negocio) {
      this.mensaje = "Es necesario asignar al cliente";
      this.abrirModal(this.mensajeModal);
      return;
    }
    if (this.transaccionForm.invalid) {
      return;
    }
    this.comprobarProductos.map(compProd => {
      if (!compProd) {
        this.mensaje = "No se han ingresado productos correctamente";
        this.abrirModal(this.mensajeModal);
        return;
      }
    });
    if (this.detalles.length == 0) {
      this.mensaje = "No se han ingresado productos";
        this.abrirModal(this.mensajeModal);
      return; 
    }
    this.calcularSubtotal();
    this.transaccion.detalles = this.detallesTransac;
    this.transaccion.empresa_id = this.usuario.empresa._id
    await this.negociosService.crearTransaccion(this.transaccion).subscribe(() => {
      window.location.href = '/mdm/clientes/negocios/transacciones/list';

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
  async obternerUltimaTransaccion() {
    await this.negociosService.obtenerUltimaTransaccion().subscribe((info) => {
      this.ultimaFactura = info.numeroFactura;
    });
  }
  async obtenerNegocio() {
    await this.negociosService.obtenerNegocioPorRuc({ ruc: this.transaccion.identificacion }).subscribe((info) => {
      if (info) {
        this.transaccion.correo = info.correoOficina;
        this.transaccion.razonSocial = info.razonSocial;
        this.transaccion.telefono = info.telefonoOficina;
        this.transaccion.negocio = info.id;
      }
    },
      (error) => {
        this.mensaje = "Negocio no encontrado";
        this.abrirModal(this.mensajeModal);
        return;
      });
  }
  async obtenerCanales() {
    await this.paramService.obtenerListaPadres("CANAL").subscribe((info) => {
      this.canalOpciones = info;
    });
  }
  abrirModal(modal) {
    this.modalService.open(modal)
  }
  cerrarModal() {
    this.modalService.dismissAll();
  }
}
