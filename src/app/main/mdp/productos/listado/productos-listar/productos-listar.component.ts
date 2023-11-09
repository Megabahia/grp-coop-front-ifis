import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {ProductosService} from '../../productos.service';

/**
 * COOP
 * ifis
 * Esta pantalla sirve para listar los productos
 * Rutas:
 * `${apiUrl}/mdp/productos/list/`,
 * `${apiUrl}/mdp/productos/delete/${id}`
 */

@Component({
    selector: 'app-productos-listar',
    templateUrl: './productos-listar.component.html'
})
export class ProductosListarComponent implements OnInit, AfterViewInit {
    @ViewChild(NgbPagination) paginator: NgbPagination;
    menu;
    vista = 'lista';
    page = 1;
    pageSize: any = 10;
    maxSize;
    collectionSize;
    listaProductos;
    idProducto = 0;

    constructor(
        private productosService: ProductosService,
        private modalService: NgbModal,
    ) {
    }

    ngOnInit(): void {
        this.menu = {
            modulo: 'mdp',
            seccion: 'prodList'
        };

    }

    async ngAfterViewInit() {
        this.iniciarPaginador();
        this.obtenerListaProductos();
    }

    async iniciarPaginador() {
        this.paginator.pageChange.subscribe(() => {
            this.obtenerListaProductos();
        });
    }

    obtenerListaProductos() {
        this.productosService.obtenerListaProductos(
            {
                page: this.page - 1,
                page_size: this.pageSize
            }
        ).subscribe((info) => {
            this.listaProductos = info.info;
            this.collectionSize = info.cont;
        });
    }

    crearProducto() {
        this.vista = 'editar';
        this.idProducto = 0;
    }

    editarProducto(id) {
        this.idProducto = id;
        this.vista = 'editar';
    }

    abrirModal(modal, id) {
        this.idProducto = id;
        this.modalService.open(modal);
    }

    cerrarModal() {
        this.modalService.dismissAll();
        this.productosService.eliminarProducto(this.idProducto).subscribe(() => {
            this.obtenerListaProductos();
        });
    }
}
