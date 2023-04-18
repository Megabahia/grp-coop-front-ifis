import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SolicitudesCreditosService} from '../../../solicitudes-creditos/solicitudes-creditos/solicitudes-creditos.service';
import {CoreMenuService} from '../../../../../@core/components/core-menu/core-menu.service';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {CoreSidebarService} from '../../../../../@core/components/core-sidebar/core-sidebar.service';
import {DatePipe} from '@angular/common';
import {Subject} from 'rxjs';
import {SolicitudesCreditos} from '../../../solicitudes-creditos/models/solicitudesCreditos';
import {SwiperConfigInterface} from 'ngx-swiper-wrapper';
import {FlatpickrOptions} from 'ng2-flatpickr';


@Component({
    selector: 'app-listar',
    templateUrl: './listar.component.html',
    styleUrls: ['./listar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {class: 'ecommerce-application'},
    providers: [DatePipe]
})
export class ListarComponent implements OnInit {
    @ViewChild(NgbPagination) paginator: NgbPagination;

    // public
    public page = 1;
    public page_size: any = 10;
    public maxSize;
    public collectionSize;
    public contentHeader: object;
    public actualizarCredito: SolicitudesCreditos;
    public listaCreditos;
    public submitted = false;
    public idCobro = '';
    public mensaje = '';
    public wishlist;
    public cartList;
    public relatedProducts;
    public productos;
    public producto;
    private _unsubscribeAll: Subject<any>;
    public actualizarCreditoForm: FormGroup;
    public actualizarCreditoFormData = new FormData();

    public swiperResponsive: SwiperConfigInterface;

    public fecha;
    public imagen = '';
    public startDateOptions: FlatpickrOptions = {
        altInput: true,
        mode: 'single',
        altFormat: 'Y-n-j',
        altInputClass: 'form-control flat-picker flatpickr-input invoice-edit-input',
    };

    public cantidadMonedas;
    public usuario;
    public cargando = false;

    constructor(
        private _formBuilder: FormBuilder,
        private _solictudesCreditosService: SolicitudesCreditosService,
        private _coreMenuService: CoreMenuService,
        private modalService: NgbModal,
        private _coreSidebarService: CoreSidebarService,
        private datePipe: DatePipe,
    ) {
        this._unsubscribeAll = new Subject();
        this.usuario = this._coreMenuService.grpIfisUser;
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngAfterViewInit() {
        this.iniciarPaginador();
    }

    obtenerSolicitudesCreditos() {
        this._solictudesCreditosService.obtenerSolicitudesCreditos({
            empresaIfis_id: this.usuario.empresa.id,
            estado: ['Autorizar', 'Rechazar'],
            page_size: this.page_size, page: this.page - 1
        }).subscribe(info => {
            this.collectionSize = info.cont;
            this.listaCreditos = info.info;
        });
    }

    ngOnInit(): void {
        this.obtenerSolicitudesCreditos();
    }

    iniciarPaginador() {
        this.paginator.pageChange.subscribe(() => {
            this.obtenerSolicitudesCreditos();
        });
    }

    abrirModal(modal) {
        this.modalService.open(modal);
    }

    cerrarModal(name) {
        this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    transformarFecha(fecha) {
        return this.datePipe.transform(fecha, 'yyyy-MM-dd');
    }

}
