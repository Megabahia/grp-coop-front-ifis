import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Categoria, CategoriasService } from './categorias.service';
import { ParamService } from 'app/services/param/param.service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';

@Component({
  selector: 'app-categorias-productos',
  templateUrl: './categorias-productos.component.html'
})
export class CategoriasProductosComponent implements OnInit {
  @ViewChild('dismissModal') dismissModal;
  @ViewChild('aviso') aviso;
  paramForm: FormGroup;
  menu;
  page = 1;
  pageSize: any = 10;
  maxSize: any;
  collectionSize: any;
  listaCategorias: any;
  categoria:Categoria;
  funcion: string;
  submitted: boolean;
  idCategoria: any;
  mensaje: string;
  estados;
  constructor(
    private modalService: NgbModal,
    private categoriasService:CategoriasService,
    private paramService:ParamService,
    private _formBuilder: FormBuilder,
    private _coreSidebarService: CoreSidebarService,
  ) {
    this.categoria = categoriasService.inicializarCategoria();
   }
  
   get f() {
    return this.paramForm.controls;
  }

  ngAfterViewInit() {
    this.paramService.obtenerListaEstado().subscribe((result) => {
      this.estados = result;
    });
  }

  ngOnInit(): void {
    this.paramForm = this._formBuilder.group({
      nombre: ['', [Validators.required]],
      codigoCategoria: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      estado: ['', [Validators.required]]
    });
    this.menu = {
      modulo:"mdp",
      seccion: "cat"
    };
    this.obtenerListaCategorias();
  }
  async obtenerListaCategorias(){
    await this.categoriasService.obtenerCategorias({
     page:this.page - 1, 
     page_size:this.pageSize
    }).subscribe((info)=>{
      this.listaCategorias = info.info;
      this.collectionSize = info.cont;
    });
  }
  async crearCategoria(name?){
    this.categoria = this.categoriasService.inicializarCategoria();
    this.funcion = 'insertar';
    this.submitted = false;
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  editarCategoria(id,name?){
    this.funcion = 'editar';
    this.submitted = false;
    this.categoriasService.obtenerCategoria(id).subscribe((info)=>{
      this.categoria = info;
    });
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }
  
  async guardarCategoria(){
    this.submitted = true;
    if (this.paramForm.invalid) {
      return;
    }
    if (this.funcion == "insertar") {
      // delete this.categoria.id
      await this.categoriasService.crearCategoria(this.categoria).subscribe(()=>{
        this.obtenerListaCategorias();
        // this.dismissModal.nativeElement.click();
        this.submitted = false;
        this.mensaje = "Categoría guardada";
        this.abrirModal(this.aviso);
      });
    }else  if (this.funcion = 'editar'){
      await this.categoriasService.actualizarCategoria(this.categoria).subscribe(()=>{
        this.obtenerListaCategorias();
        // this.dismissModal.nativeElement.click();
        this.submitted = false;
        this.mensaje = "Categoría editada";
        this.abrirModal(this.aviso);
      });
    }
  }
  abrirModal(modal, id = null) {
    this.idCategoria = id;
    this.modalService.open(modal)
  }
  cerrarModal() {
    this.modalService.dismissAll();
    this.categoriasService.eliminarCategoria(this.idCategoria).subscribe(() => {
      this.obtenerListaCategorias();
    });
  }
  cerrarModalCore(name){
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

}
