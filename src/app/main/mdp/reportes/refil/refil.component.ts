import { Component, OnInit } from '@angular/core';
import { ExportService } from 'app/services/export/export.service';
import { ProductosService } from '../../productos/productos.service';

@Component({
  selector: 'app-productos-refil',
  templateUrl: './refil.component.html'
})
export class RefilComponent implements OnInit {
  menu;
  listaProductos;
  inicio=0;
  fin=30;
  categoria="";
  subcategoria="";
  page = 1;
  pageSize: any = 10;
  maxSize;
  collectionSize;
  infoExportar;
  constructor(
    private productosService:ProductosService,
    private exportFile:ExportService
  ) { }

  ngOnInit(): void {
    this.menu = {
      modulo: "mdp",
      seccion: "refilRep"
    };
    this.obtenerListaProductos();
  }
  obtenerListaProductos(){
    this.productosService.obtenerListaRefil({
        inicio:this.inicio,
        fin:this.fin,
        categoria:this.categoria,
        subCategoria:this.subcategoria,
        page:this.page-1,
        page_size:this.pageSize
    }).subscribe((info)=>{
        this.listaProductos = info.info;
        this.collectionSize = info.cont;
    });
  }
  exportarExcel(){
    this.infoExportar = [];
        const headers = ['Código de Barras', 'Nombre', 'Categoría', 'Subcategoría', '# De días de refil', 'Estado'];
        this.listaProductos.forEach((row: any) => {
          
          const values = [];
          values.push(row['codigoBarras']);
          values.push(row['nombre']);
          values.push(row['categoria']);
          values.push(row['subCategoria']);
          values.push(row['refil']);
          values.push(row['variableRefil']);
          this.infoExportar.push(values);
        });
        const reportData = {
          title: 'Reporte de Refil',
          data: this.infoExportar,
          headers
        };
  
        this.exportFile.exportExcel(reportData);
  }
}
