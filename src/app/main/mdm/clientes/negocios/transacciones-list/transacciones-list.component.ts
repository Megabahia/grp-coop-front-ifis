import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {ChartOptions, ChartType, ChartDataSets} from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { DatePipe } from '@angular/common';
import { NegociosService, Transaccion } from '../negocios.service';
@Component({
  selector: 'app-transacciones-list',
  templateUrl: './transacciones-list.component.html',
  encapsulation: ViewEncapsulation.None,
  host: { class: 'ecommerce-application' },
  providers:[DatePipe]
})
export class TransaccionesListComponent implements OnInit {
  menu;
  page = 1;
  pageSize = 10;
  collectionSize;
  listaTransacciones;
  inicio = new Date();
  fin = new Date();
  transaccion: Transaccion;
  basicDemoValue = '2017-01-01';

  public barChartOptions: ChartOptions = {
    responsive: true,
    aspectRatio: 1
  };
  public barChartLabels: Label[] = [
    '2006',
    '2007',
    '2008',
    '2009',
    '2010',
    '2011',
    '2012'
  ];
  public barChartType: ChartType = 'line';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] =
    [];
  public barChartColors: Color[] = [{
    backgroundColor: '#84D0FF'
  }];
  datosTransferencias = {
    data: [], label: 'Series A',fill: false,borderColor: 'rgb(75, 192, 192)'
  }
  constructor(
    private datePipe: DatePipe,
    private negociosService: NegociosService
  ) {
    this.inicio.setMonth(this.inicio.getMonth() - 3);
    this.transaccion = this.negociosService.inicializarTransaccion();

  }

  ngOnInit(): void {
    this.menu = {
      modulo: "mdm",
      seccion: "negociosTransac"
    };
    this.barChartData = [this.datosTransferencias];
    this.obtenerTransacciones();
  }
  obtenerTransacciones() {
    this.negociosService.obtenerTodasTrasacciones({
      page: this.page - 1,
      page_size: this.pageSize,
      inicio:this.inicio,
      fin:this.fin
    }).subscribe((info) => {
      this.collectionSize = info.cont;
      this.listaTransacciones = info.info;
      this.obtenerGraficos();
    });
  }
  transformarFecha(fecha) {
    let nuevaFecha = this.datePipe.transform(fecha, 'yyyy-MM-dd');
    return nuevaFecha;
  }

  async obtenerTransaccion(id) {
    this.negociosService.obtenerTransaccion(id).subscribe((info) => {
      this.transaccion = info;
    });
  }
  async obtenerGraficos(){
    this.negociosService.obtenerGraficaTransaccionesGeneral({
      page:this.page-1,
        page_size:this.pageSize,
        inicio:this.inicio,
        fin:this.fin
    }
      ).subscribe((info)=>{
        let etiquetas =[];
        let valores =[];
        
        info.map((datos)=>{
          etiquetas.push(datos.anio + "-"+datos.mes);
          valores.push(datos.cantidad);
        });
        this.datosTransferencias= {
          data: valores, label: 'Series A',fill: false,borderColor: 'rgb(75, 192, 192)'
        }
        this.barChartData=[this.datosTransferencias];
        this.barChartLabels = etiquetas;
    });
  }
}
