import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subcategoria, SubcategoriasService } from './subcategorias.service';
import { CategoriasService } from '../categorias-productos/categorias.service';
import { ParamService } from 'app/services/param/param.service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';

@Component({
  selector: 'app-subcategorias-productos',
  templateUrl: './subcategorias-productos.component.html'
})
export class SubcategoriasProductosComponent implements OnInit {
  @ViewChild('dismissModal') dismissModal;
  @ViewChild('aviso') aviso;
  paramForm: FormGroup;
  menu;
  page = 1;
  pageSize: any = 10;
  maxSize;
  submitted: boolean;
  collectionSize;
  listaSubcategorias;
  subcategoria:Subcategoria;
  idSubcategoria;
  categoriasPadre;
  estados;
  mensaje;
  funcion;
  constructor(
    private modalService: NgbModal,
    private subcategoriasService:SubcategoriasService,
    private categoriasService:CategoriasService,
    private paramService:ParamService,
    private _formBuilder: FormBuilder,
    private _coreSidebarService: CoreSidebarService,
  ) {
    this.subcategoria = subcategoriasService.inicializarSubcategoria();
   }

   get f() {
    return this.paramForm.controls;
  }

  async ngAfterViewInit() {
    await this.categoriasService.obtenerListaCategorias().subscribe((result) => {
      this.categoriasPadre = result;
    });
    await this.paramService.obtenerListaEstado().subscribe((result) => {
        this.estados = result;
    });
  }

  ngOnInit(): void {
    this.paramForm = this._formBuilder.group({
      nombre: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
      codigoSubCategoria: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      estado: ['', [Validators.required]]
    });
    this.menu = {
      modulo:"mdp",
      seccion: "subCat"
    };
    this.obtenerListaSubcategorias();
  }
  async obtenerListaSubcategorias(){
    await this.subcategoriasService.obtenerListaSubcategoria({
     page:this.page - 1, 
     page_size:this.pageSize
    }).subscribe((info)=>{
      this.listaSubcategorias = info.info;
      this.collectionSize = info.cont;
    });
  }
  async crearSubcategoria(name?){
    this.subcategoria = await this.subcategoriasService.inicializarSubcategoria();
    this.funcion = 'insertar';
    this.submitted = false;
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  async editarSubcategoria(id,name?){
    this.funcion = 'editar';
    this.submitted = false;
    await this.subcategoriasService.obtenerSubcategoria(id).subscribe((info)=>{
      this.subcategoria = info;
    });
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }
  
  async guardarSubcategoria(){
    this.submitted = true;
    console.log('SubCategoria ', this.subcategoria);
    if (this.paramForm.invalid) {
      return;
    }
    
    
    if(this.funcion == "insertar"){
      await this.subcategoriasService.crearSubcategoria(this.subcategoria).subscribe(()=>{
        this.obtenerListaSubcategorias();
        this.dismissModal.nativeElement.click();
        this.submitted = false;
        this.mensaje = "Categoría guardada";
        this.abrirModal(this.aviso);
      });
    }else if (this.funcion = 'editar'){
      await this.subcategoriasService.actualizarSubcategoria(this.subcategoria).subscribe(()=>{
        this.obtenerListaSubcategorias();
        this.dismissModal.nativeElement.click();
        this.submitted = false;
        this.mensaje = "Sub Categoría editada";
        this.abrirModal(this.aviso);
      });
    }
  }
  abrirModal(modal, id = null) {
    this.idSubcategoria = id;
    this.modalService.open(modal)
  }
  async cerrarModal() {
    this.modalService.dismissAll();
    await this.subcategoriasService.eliminarSubcategoria(this.idSubcategoria).subscribe(() => {
      this.obtenerListaSubcategorias();
    });
  }
  cerrarModalCore(name){
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

}
