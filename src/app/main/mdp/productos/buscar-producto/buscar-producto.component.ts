import { Component, OnInit } from '@angular/core';
import { ExportService } from 'app/services/export/export.service';
import { ProductosService } from '../productos.service';

@Component({
  selector: 'app-buscar-producto',
  templateUrl: './buscar-producto.component.html'
})
export class BuscarProductoComponent implements OnInit {
  menu;
  listaProductos;
  page = 1;
  pageSize: any = 10;
  maxSize;
  collectionSize;
  codigoBarras="";
  nombre="";
  infoExportar;
  constructor(
    private productosService:ProductosService,
    private exportFile:ExportService
  ) { }

  ngOnInit(): void {
    this.menu = {
      modulo:"mdp",
      seccion: "prodBusq"
    };
    this.obtenerListaProductos();
  }

  obtenerListaProductos(){
    this.productosService.buscarListaProductos({
      nombre:this.nombre,
      codigoBarras:this.codigoBarras,
        page:this.page-1,
        page_size:this.pageSize
    }).subscribe((info)=>{
        this.listaProductos = info.info;
        this.collectionSize = info.cont
    });
  }
  exportarExcel(){
    this.infoExportar = [];
        const headers = ['Código de Barras', 'Nombre', 'Categoría', 'Subcategoría', 'Stock', 'Estado'];
        this.listaProductos.forEach((row: any) => {
          
          const values = [];
          values.push(row['codigoBarras']);
          values.push(row['nombre']);
          values.push(row['categoria']);
          values.push(row['subCategoria']);
          values.push(row['stock']);
          values.push(row['estado']);
          this.infoExportar.push(values);
        });
        const reportData = {
          title: 'Reporte de Productos',
          data: this.infoExportar,
          headers
        };
  
        this.exportFile.exportExcel(reportData);
  }
}
