import { Component, OnInit, ViewChild } from "@angular/core";
import { NgbModal, NgbPagination } from "@ng-bootstrap/ng-bootstrap";
import { DatePipe } from "@angular/common";
import { RefilService } from "./refil.service";
import { ParamService } from "app/services/param/param.service";
import { ExportService } from "app/services/export/export.service";

@Component({
  selector: "app-refil",
  templateUrl: "./refil.component.html",
  providers: [DatePipe],
})
export class RefilComponent implements OnInit {
  @ViewChild(NgbPagination) paginator: NgbPagination;

  menu;
  page = 1;
  pageSize: any = 10;
  maxSize;
  collectionSize;
  identificacion;
  fecha = "";
  inicio = "";
  fin = "";
  ultimosProductos;
  prediccion;
  cliente;
  tipoCliente = "";
  tipoClienteModal = "";
  infoExportar = [];
  listaPredicciones;
  constructor(
    private refilService: RefilService,
    private datePipe: DatePipe,
    private globalParam: ParamService,
    private exportFile: ExportService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.menu = {
      modulo: "mdo",
      seccion: "predRefil",
    };
  }
  async ngAfterViewInit() {
    this.iniciarPaginador();
    this.obtenerListaPredicciones();
  }
  obtenerListaPredicciones() {
    let fecha = this.fecha.split(" to ");
    this.inicio = fecha[0] ? fecha[0] : "";
    this.fin = fecha[1] ? fecha[1] : "";
    if (this.inicio != "" && this.fin == "") {
      this.fin = this.inicio;
    }
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
    this.refilService.obtenerListaPredicciones(busqueda).subscribe((info) => {
      this.listaPredicciones = info.info;
      this.collectionSize = info.cont;
    });
  }
  async iniciarPaginador() {
    this.paginator.pageChange.subscribe(() => {
      this.obtenerListaPredicciones();
    });
  }
  transformarFecha(fecha) {
    let nuevaFecha = this.datePipe.transform(fecha, "yyyy-MM-dd");
    return nuevaFecha;
  }
  obtenerURLImagen(url) {
    return this.globalParam.obtenerURL(url);
  }
  obtenerProductosPrediccion(id) {
    this.refilService.obtenerProductosPrediccion(id).subscribe((info) => {
      if ("negocio" in info) {
        this.tipoClienteModal = "negocio";
        info.negocio.imagen = this.obtenerURLImagen(info.negocio.imagen);
      } else {
        this.tipoClienteModal = "cliente";
        info.cliente.imagen = this.obtenerURLImagen(info.cliente.imagen);
      }
      info.productos.map((prod) => {
        prod.imagen = this.obtenerURLImagen(prod.imagen);
        prod.predicciones.imagen = this.obtenerURLImagen(
          prod.predicciones.imagen
        );
      });
      this.prediccion = info;
    });
  }

  abrirModal(modal) {
    /* this.ofertaId = id; */
    this.modalService.open(modal);
  }
}
