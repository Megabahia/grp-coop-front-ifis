import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { ExportService } from 'app/services/export/export.service';
import { ProductosService } from '../../productos/productos.service';

@Component({
  selector: 'app-rotacion',
  templateUrl: './rotacion.component.html',
  providers:[DatePipe]
})
export class RotacionComponent implements OnInit {
  @ViewChild(NgbPagination) paginator: NgbPagination;
  menu;
  inicio = "";
  fin = "";
  categoria = "";
  categoriasOpciones;
  subcategoria = "";
  subcategoriasOpciones;
  page = 1;
  pageSize: any = 10;
  maxSize;
  collectionSize;
  listaProductos;
  infoExportar;
  constructor(
    private productosService:ProductosService,
    private datePipe: DatePipe,
    private exportFile: ExportService,
  ) { }

  ngOnInit(): void {
    this.menu = {
      modulo: "mdp",
      seccion: "rotaRep"
    };
  }
  async ngAfterViewInit() {
    this.obtenerListaProductos();
    this.iniciarPaginador();
  }
  async iniciarPaginador() {
    this.paginator.pageChange.subscribe(() => {
      this.obtenerListaProductos();
    });
  }

  obtenerListaProductos() {
    this.productosService.obtenerListaRotacion({
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
    const headers = ['Código de Barras', 'Nombre', 'Categoría', 'Subcategoría', 'Stock', 'Ultima Fecha de Stock', 'Monto de Compra'];
    this.listaProductos.forEach((row: any) => {

      const values = [];
      values.push(row['codigoBarras']);
      values.push(row['nombre']);
      values.push(row['categoria']);
      values.push(row['subCategoria']);
      values.push(row['stock']);
      values.push(this.transformarFecha(row['fechaUltimaStock']));
      values.push(row['montoCompra']);
      this.infoExportar.push(values);
    });
    const reportData = {
      title: 'Reporte de Stock',
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
