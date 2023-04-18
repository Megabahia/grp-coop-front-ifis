import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbPagination, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Producto, ProductosService } from '../../productos.service';
import { CategoriasService } from '../../categorias-productos/categorias.service';
import { SubcategoriasService } from '../../subcategorias-productos/subcategorias.service';
import { ParamService } from 'app/services/param/param.service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';

@Component({
  selector: 'app-productos-editar',
  templateUrl: './productos-editar.component.html',
  styleUrls: ['./productos-editar.component.scss'],
})
export class ProductosEditarComponent implements OnInit {
  @Input() idProducto;
  @ViewChild('dismissModal') dismissModal;
  @ViewChild(NgbPagination) paginator: NgbPagination;
  @ViewChild('eliminarImagenMdl') eliminarImagenMdl;
  idImagen = 0;
  imagenes;
  cantImagenes = 0;
  @ViewChild('aviso') aviso;
  producto: Producto;
  datosProducto: FormData = new FormData();
  productoForm: FormGroup;
  fichaTecnicaForm: FormGroup;
  submittedProductoForm: boolean = false;
  submittedFichaTecnicaForm: boolean = false;
  opcion;
  categoriasOpciones;
  subcategoriasOpciones;
  fichaTecnica;
  fichaTecnicaLista;
  idFichaTecnica;
  abastecimientoOpciones;
  archivos: File[] = [];
  mensaje: string;
  numRegex = /^-?\d*[.,]?\d{0,2}$/;

  constructor(
    private categoriasService: CategoriasService,
    private subcategoriasService: SubcategoriasService,
    private productosService: ProductosService,
    private modalService: NgbModal,
    private paramService: ParamService,
    private _formBuilder: FormBuilder,
    private _coreSidebarService: CoreSidebarService,
  ) {
    this.producto = this.productosService.inicializarProducto();
    this.fichaTecnica = this.productosService.inicializarFichaTecnica();
  }

  get fp() {
    return this.productoForm.controls;
  }
  get fft() {
    return this.fichaTecnicaForm.controls;
  }

  ngOnInit(): void {
    this.productoForm = this._formBuilder.group({
      categoria: ['', [Validators.required]],
      subCategoria: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      codigoBarras: ['', [Validators.required]],
      refil: ['', [Validators.required]],
      stock: ['', [Validators.required]],
      parametrizacion: ['', [Validators.required, Validators.minLength(1)]],
      costoCompra: ['', [Validators.required, Validators.pattern(this.numRegex)]],
      precioVentaA: ['', [Validators.required, Validators.pattern(this.numRegex)]],
      precioVentaB: ['', [Validators.required, Validators.pattern(this.numRegex)]],
      precioVentaC: ['', [Validators.required, Validators.pattern(this.numRegex)]],
      precioVentaD: ['', [Validators.required, Validators.pattern(this.numRegex)]],
      precioVentaE: ['', [Validators.required, Validators.pattern(this.numRegex)]],
      precioVentaBultos: ['', [Validators.required, Validators.pattern(this.numRegex)]],
      estado: ['', [Validators.required]],
      variableRefil: ['', [Validators.required]],
      fechaCaducidad: ['', [Validators.required]],
      fechaElaboracion: ['', [Validators.required]],
    });
    this.fichaTecnicaForm = this._formBuilder.group({
      codigo: ['', [Validators.required]],
      nombreAtributo: ['', [Validators.required]],
      valor: ['', [Validators.required]]
    })
    this.obtenerAbastecimientoOpciones();
    this.obtenerCategoriasOpciones();
    if (this.idProducto != 0) {
      this.obtenerProducto();
      this.obtenerFichasTecnicas();
    }
  }
  obtenerProducto() {
    this.productosService.obtenerProducto(this.idProducto).subscribe((info) => {
      let producto = info;
      this.imagenes = info.imagenes;
      delete producto.imagenes;
      this.producto = producto;
      this.obtenerListaSubcategorias();
    });
  }
  async obtenerAbastecimientoOpciones() {
    await this.paramService.obtenerListaPadres("ALERTA_ABASTECIMIENTO").subscribe((info) => {
      this.abastecimientoOpciones = info;
    });
  }
  obtenerFichasTecnicas() {
    this.productosService.obtenerFichasTecnicas(this.idProducto).subscribe((info) => {
      this.fichaTecnicaLista = info.info;
    });
  }
  async obtenerCategoriasOpciones() {
    await this.categoriasService.obtenerListaCategorias().subscribe((info) => {
      this.categoriasOpciones = info;
    });
  }
  async obtenerListaSubcategorias() {
    await this.subcategoriasService.obtenerListaSubcategoriasHijas(this.producto.categoria).subscribe((info) => {
      this.subcategoriasOpciones = info;
    });
  }

  onSelect(event) {
    if (this.archivos && this.archivos.length - this.imagenes.length > 0) {
      this.onRemove(this.archivos[0]);
    }
    this.archivos.push(...event.addedFiles);
  }

  onRemove(event) {
    this.archivos.splice(this.archivos.indexOf(event), 1);
  }
  removeAll() {
    this.archivos = [];
  }
  guardarProducto() {
    let llaves = Object.keys(this.producto);
    let valores = Object.values(this.producto);
    this.datosProducto = new FormData();

    valores.map((valor, pos) => {
      this.datosProducto.append(llaves[pos], valor)
    });

    // this.productosService.crearProducto(this.datosProducto).subscribe((info) => {
    //   console.log(info);
    // });
    this.submittedProductoForm = true;
    if (this.productoForm.invalid) {
      return;
    }
    let fechaCaducidad = moment(this.producto.fechaCaducidad, 'YYYY-MM-DD');
    let fechaElaboracion = moment(this.producto.fechaElaboracion, 'YYYY-MM-DD');
    let diferenciaDiasElabCad = fechaCaducidad.diff(fechaElaboracion, 'days');
    let diferenciaDiasHoyCad = fechaCaducidad.diff(moment(), 'days');
    if (diferenciaDiasElabCad < 0) {
      this.mensaje = "La fecha de caducidad debe ser mayor a la de elaboración"
      this.abrirModal(this.aviso);
      return;
    }
    if (diferenciaDiasHoyCad < 0) {
      this.mensaje = "La fecha de caducidad debe ser mayor a la fecha actual"
      this.abrirModal(this.aviso);
      return;
    }
    if (this.idProducto != 0) {

      this.archivos.map((valor, pos) => {
        this.datosProducto.append("imagenes[" + pos + "]id", "0");
        this.datosProducto.append("imagenes[" + pos + "]imagen", valor);
      });
      this.productosService.actualizarProducto(this.datosProducto, this.idProducto).subscribe((info) => {
        this.mensaje = "Producto actualizado";
        this.abrirModal(this.aviso);
      },
        (error) => {
          let errores = Object.values(error);
          let llaves = Object.keys(error);
          this.mensaje = "";
          errores.map((infoErrores, index) => {
            this.mensaje += llaves[index] + ": " + infoErrores + "<br>";
          });
          this.abrirModal(this.aviso);
        });
    } else {
      this.archivos.map((valor, pos) => {
        this.datosProducto.append("imagenes[" + pos + "]id", "0");
        this.datosProducto.append("imagenes[" + pos + "]imagen", valor);
      });
      this.productosService.crearProducto(this.datosProducto).subscribe((info) => {
        this.idProducto = info.id;
        this.mensaje = "Producto guardado";
        this.abrirModal(this.aviso);
      },
        (error) => {
          let errores = Object.values(error);
          let llaves = Object.keys(error);
          this.mensaje = "";
          errores.map((infoErrores, index) => {
            this.mensaje += llaves[index] + ": " + infoErrores + "<br>";
          });
          this.abrirModal(this.aviso);
        });
    }
  }
  eliminarImagenModal(id) {
    this.idImagen = id;
    this.modalService.open(this.eliminarImagenMdl);
  }
  eliminarImagen() {
    this.productosService.eliminarImagen(this.idImagen).subscribe((info) => {
      this.obtenerProducto();
      this.modalService.dismissAll();

    });
  }
  crearFichaTecnica(name?) {
    this.fichaTecnica = this.productosService.inicializarFichaTecnica();
    this.opcion = "insertar";
    this.submittedFichaTecnicaForm = false;
    this.fichaTecnica.producto = this.idProducto;
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }
  editarFichaTecnica(id,name?) {
    this.productosService.obtenerFichaTecnica(id).subscribe((info) => {
      this.fichaTecnica = info;
      this.submittedFichaTecnicaForm = false;
      this.opcion = "editar"
    });
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }
  eliminarFichaTecnica(id) {
    this.productosService.eliminarFichaTecnica(id).subscribe(() => {
    });
  }
  guardarFichaTecnica() {
    this.submittedFichaTecnicaForm = true;
    if (this.fichaTecnicaForm.invalid) {
      return;
    }
    if (this.opcion === "insertar") {
      if (this.idProducto != 0) {
        this.productosService.crearFichaTecnica(this.fichaTecnica).subscribe((info) => {
          this.obtenerFichasTecnicas();
          this.dismissModal.nativeElement.click();
          this.submittedFichaTecnicaForm = false;
          this.mensaje = "Ficha técnica guardada";
          this.abrirModal(this.aviso);
        },
          (error) => {
            let errores = Object.values(error);
            let llaves = Object.keys(error);
            this.mensaje = "";
            errores.map((infoErrores, index) => {
              this.mensaje += llaves[index] + ": " + infoErrores + "<br>";
            });
            this.abrirModal(this.aviso);
          });
      } else {
        this.mensaje = "Es necesario ingresar un producto primero";
        this.abrirModal(this.aviso);
      }
    } else if (this.opcion === "editar") {
      this.productosService.editarFichaTecnica(this.fichaTecnica).subscribe((info) => {
        this.obtenerFichasTecnicas();
        this.dismissModal.nativeElement.click();
        this.submittedFichaTecnicaForm = false;
        this.mensaje = "Ficha técnica guardada";
        this.abrirModal(this.aviso);
      },
        (error) => {
          let errores = Object.values(error);
          let llaves = Object.keys(error);
          this.mensaje = "";
          errores.map((infoErrores, index) => {
            this.mensaje += llaves[index] + ": " + infoErrores + "<br>";
          });
          this.abrirModal(this.aviso);
        });
    }
  }
  abrirModal(modal, id = null) {
    this.idFichaTecnica = id;
    this.modalService.open(modal);
  }
  cerrarModalMensaje() {
    this.modalService.dismissAll();
  }
  abrirModalMensaje(modal) {
    this.modalService.open(modal);
  }
  cerrarModal() {
    this.modalService.dismissAll();
    this.productosService.eliminarFichaTecnica(this.idFichaTecnica).subscribe(() => {
      this.obtenerFichasTecnicas();
    });
  }
  cerrarModalEliminar() {
    this.modalService.dismissAll();
  }
  cerrarModalCore(name){
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }
}
