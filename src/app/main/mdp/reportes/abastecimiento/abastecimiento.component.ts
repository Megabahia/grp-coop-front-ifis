import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { CategoriasService } from '../../productos/categorias-productos/categorias.service';
import { SubcategoriasService } from '../../productos/subcategorias-productos/subcategorias.service';
import { ProductosService } from '../../productos/productos.service';
import { ExportService } from 'app/services/export/export.service';

@Component({
  selector: 'app-productos-abastecimiento',
  templateUrl: './abastecimiento.component.html',
  providers:[DatePipe]
})
export class AbastecimientoComponent implements OnInit {
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
    private categoriasService: CategoriasService,
    private subcategoriasService: SubcategoriasService,
    private productosService: ProductosService,
    private datePipe: DatePipe,
    private exportFile: ExportService,
  ) { }

  ngOnInit(): void {
    this.menu = {
      modulo: "mdp",
      seccion: "abastRep"
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
    this.productosService.obtenerListaAbastecimiento(
      {
        inicio: this.inicio,
        fin: this.fin,
        categoria: this.categoria,
        subCategoria: this.subcategoria,
        page: this.page - 1,
        page_size: this.pageSize
      }
    ).subscribe((info) => {
      this.listaProductos = info.info;
      this.collectionSize = info.cont;
    });
  }

  exportarExcel() {
    this.infoExportar = [];
    const headers = ['Código de Barras', 'Nombre', 'Categoría', 'Subcategoría', 'Stock', 'Alerta de Abastecimiento' , 'Cantidad sugerida de Stock', 'Fecha máxima de stock'];
    this.listaProductos.forEach((row: any) => {

      const values = [];
      values.push(row['codigoBarras']);
      values.push(row['nombre']);
      values.push(row['categoria']);
      values.push(row['subCategoria']);
      values.push(row['stock']);
      values.push(row['alertaAbastecimiento']);
      values.push(row['cantidadSugeridaStock']);
      values.push(this.transformarFecha(row['fechaMaximaStock']));
      this.infoExportar.push(values);
    });
    const reportData = {
      title: 'Reporte de Abastecimiento',
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
