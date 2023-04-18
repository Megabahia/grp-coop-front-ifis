import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { CategoriasService } from '../../productos/categorias-productos/categorias.service';
import { SubcategoriasService } from '../../productos/subcategorias-productos/subcategorias.service';
import { ProductosService } from '../../productos/productos.service';
import { ExportService } from 'app/services/export/export.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  providers: [DatePipe]
})
export class StockComponent implements OnInit {
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
    private categoriasService: CategoriasService,
    private subcategoriasService: SubcategoriasService,
    private productosService: ProductosService,
    private exportFile: ExportService,
    private datePipe: DatePipe,

  ) { }

  ngOnInit(): void {
    this.menu = {
      modulo: "mdp",
      seccion: "stockRep"
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
    this.productosService.obtenerListaStock({
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
