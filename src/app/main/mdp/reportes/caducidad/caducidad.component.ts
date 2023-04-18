import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { ProductosService } from '../../productos/productos.service';
import { ExportService } from 'app/services/export/export.service';


@Component({
  selector: 'app-productos-caducidad',
  templateUrl: './caducidad.component.html',
  providers: [DatePipe]
})
export class CaducidadComponent implements OnInit {
  @ViewChild(NgbPagination) paginator: NgbPagination;

  menu;
  page = 1;
  pageSize: any = 10;
  maxSize;
  collectionSize;
  inicio= "";
  fin = "";
  categoria= "";
  categoriasOpciones;
  subcategoria = "";
  subcategoriasOpciones;
  listaProductos;
  infoExportar;
  constructor(
    private productosService:ProductosService,
    private datePipe:DatePipe,
    private exportFile: ExportService,

  ) { }

  ngOnInit(): void {
    this.menu = {
      modulo: "mdp",
      seccion: "caduRep"
    };
    this.obtenerListaProductos();
  }

  async ngAfterViewInit() {
    this.iniciarPaginador();
  }
  async iniciarPaginador() {
    this.paginator.pageChange.subscribe(() => {
      this.obtenerListaProductos();
    });
  }
  obtenerListaProductos() {
    this.productosService.obtenerListaCaducidad({
      inicio: this.inicio,
      fin: this.fin,
      categoria: this.categoria,
      subCategoria: this.subcategoria,
      page: this.page - 1,
      page_size: this.pageSize
    }).subscribe((info) => {
      this.listaProductos = info.info;
      this.collectionSize = info.cont;
    });
  }
  exportarExcel() {
    this.infoExportar = [];
    const headers = ['Código de Barras', 'Nombre', 'Categoría', 'Subcategoría', 'Fecha Caducidad', 'Productos Caducados' , 'Dias para caducar'];
    this.listaProductos.forEach((row: any) => {

      const values = [];
      values.push(row['codigoBarras']);
      values.push(row['nombre']);
      values.push(row['categoria']);
      values.push(row['subCategoria']);
      values.push(this.transformarFecha(row['fechaCaducidad']));
      values.push(row['productosCaducados']);
      values.push(row['diasParaCaducar']);
      this.infoExportar.push(values);
    });
    const reportData = {
      title: 'Reporte de Caducidad',
      data: this.infoExportar,
      headers
    };

    this.exportFile.exportExcel(reportData);
  }
  transformarFecha(fecha) {
    let nuevaFecha = this.datePipe.transform(fecha, 'yyyy-MM-dd');
    return nuevaFecha;
  }
}
