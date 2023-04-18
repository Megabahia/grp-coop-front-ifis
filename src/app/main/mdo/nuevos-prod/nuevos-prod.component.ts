import { Component, OnInit, ViewChild } from "@angular/core";
import { NgbPagination } from "@ng-bootstrap/ng-bootstrap";
import { DatePipe } from "@angular/common";
import { NuevosService } from "./nuevos.service";
import { ParamService } from "app/services/param/param.service";
import { ExportService } from "app/services/export/export.service";

@Component({
  selector: "app-nuevos-prod",
  templateUrl: "./nuevos-prod.component.html",
  providers: [DatePipe],
})
export class NuevosProdComponent implements OnInit {
  @ViewChild(NgbPagination) paginator: NgbPagination;

  menu;
  listaPredicciones;
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
  constructor(
    private nuevosService: NuevosService,
    private datePipe: DatePipe,
    private globalParam: ParamService,
    private exportFile: ExportService
  ) {}

  ngOnInit(): void {
    this.menu = {
      modulo: "mdo",
      seccion: "predNueProd",
    };
  }
  async ngAfterViewInit() {
    this.iniciarPaginador();
    this.obtenerListaPredicciones();
  }
  async iniciarPaginador() {
    this.paginator.pageChange.subscribe(() => {
      this.obtenerListaPredicciones();
    });
  }

  obtenerListaPredicciones() {
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
    this.nuevosService.obtenerListaPredicciones(busqueda).subscribe((info) => {
      this.listaPredicciones = info.info;
      this.collectionSize = info.cont;
    });
  }

  transformarFecha(fecha) {
    let nuevaFecha = this.datePipe.transform(fecha, "yyyy-MM-dd");
    return nuevaFecha;
  }
  obtenerURLImagen(url) {
    return this.globalParam.obtenerURL(url);
  }
  obtenerUltimosProductos(id) {
    return this.nuevosService.obtenerUltimosProductos(id).subscribe((info) => {
      info.map((prod) => {
        prod.imagen = this.obtenerURLImagen(prod.imagen);
      });
      this.ultimosProductos = info;
    });
  }
  obtenerProductosPrediccion(id) {
    this.nuevosService.obtenerProductosPrediccion(id).subscribe((info) => {
      if ("negocio" in info) {
        this.tipoClienteModal = "negocio";
        info.negocio.imagen = this.obtenerURLImagen(info.negocio.imagen);
      } else {
        this.tipoClienteModal = "cliente";
        info.cliente.imagen = this.obtenerURLImagen(info.cliente.imagen);
      }

      info.productos.map((prod) => {
        prod.imagen = this.obtenerURLImagen(prod.imagen);
        prod.predicciones.map((pred) => {
          pred.imagen = this.obtenerURLImagen(pred.imagen);
        });
      });
      this.prediccion = info;
    });
  }
  exportarExcel() {
    this.infoExportar = [];
    const headers = [
      "Código",
      "Fecha de predicción",
      "Nombre Cliente",
      "Apellido Cliente",
      "Identificación",
      "#Contacto",
      "Correo",
      "Fecha última compra",
      "Monto última compra",
    ];
    let objetoExportar = Object.create(this.listaPredicciones);
    objetoExportar.forEach((row: any) => {
      const values = [];
      values.push(row["id"]);
      values.push(this.transformarFecha(row["fechaPredicciones"]));
      values.push(row["nombres"]);
      values.push(row["apellidos"]);
      values.push(row["identificacion"]);
      values.push(row["telefono"]);
      values.push(row["correo"]);
      values.push(this.transformarFecha(row["created_at"]));
      values.push(row["total"]);
      this.infoExportar.push(values);
    });
    const reportData = {
      title: "Reporte de Predicciones de Crosseling",
      data: this.infoExportar,
      headers,
    };

    this.exportFile.exportExcel(reportData);
  }
}
