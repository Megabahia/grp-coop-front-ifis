import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { NegociosService } from '../negocios.service';

@Component({
  selector: 'app-negocios-list',
  templateUrl: './negocios-list.component.html',
  encapsulation: ViewEncapsulation.None,
  host: { class: 'ecommerce-application' },
})
export class NegociosListComponent implements OnInit {
  @ViewChild(NgbPagination)paginator:NgbPagination;
  menu;
  vista="lista";
  idNegocio;
  page=1;
  pageSize=10;
  collectionSize;
  negocio;
  negocios;
  inicio;
  fin;
  ruc;
  constructor(
    private negociosService:NegociosService,
    private modalService: NgbModal

    ) { }

  ngOnInit(): void {
    this.menu = {
      modulo:"mdm",
      seccion: "negociosList"
    };
    this.obtenerListaNegocios();
  }
  async ngAfterViewInit() {
    this.iniciarPaginador();
  }
  async iniciarPaginador() {
    this.paginator.pageChange.subscribe(() => {
      this.obtenerListaNegocios();
    });
  }
  async obtenerListaNegocios(){
    this.negociosService.obtenerListaNegocios(
      {
        nombreComercial: this.negocio,
        cedula:this.ruc,
        inicio:this.inicio,
        fin:this.fin,
        page:this.page-1,
        page_size:this.pageSize}).subscribe((info)=>{
          this.collectionSize=info.cont;
          this.negocios=info.info;
    });
  }
  crearNegocio(){
    this.idNegocio= 0;
    this.vista= 'editar';
  }
  editarNegocio(id){
    this.idNegocio= id;
    this.vista= 'editar';
  }
  // eliminarNegocio(id){
  //   this.negociosService.eliminarNegocio(id).subscribe(()=>{
  //     this.obtenerListaNegocios();
  //   });
  // }
  abrirModal(modal,id){
    this.idNegocio=id;
    this.modalService.open(modal)
  }
  cerrarModal(){
    this.modalService.dismissAll();
    this.negociosService.eliminarNegocio(this.idNegocio).subscribe(()=>{
      this.obtenerListaNegocios();
    });
  }
}
