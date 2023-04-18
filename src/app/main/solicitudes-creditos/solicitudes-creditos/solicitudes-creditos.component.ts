import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {NgbPagination, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {SwiperConfigInterface} from 'ngx-swiper-wrapper';
import {CoreMenuService} from '../../../../@core/components/core-menu/core-menu.service';
import {CoreSidebarService} from '../../../../@core/components/core-sidebar/core-sidebar.service';
import {SolicitudesCreditos} from '../models/solicitudesCreditos';
import {SolicitudesCreditosService} from './solicitudes-creditos.service';
import {DatePipe} from '@angular/common';
import {FlatpickrOptions} from 'ng2-flatpickr';
import moment from 'moment';

@Component({
    selector: 'app-solicitudes-creditos',
    templateUrl: './solicitudes-creditos.component.html',
    styleUrls: ['./solicitudes-creditos.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {class: 'ecommerce-application'},
    providers: [DatePipe]
})
export class SolicitudesCreditosComponent implements OnInit {

    @ViewChild('confirmarPreautorizacionMdl') confirmarPreautorizacionMdl;
    @ViewChild('mensajeModal') mensajeModal;
    @ViewChild('detalleCreditoMdl') detalleCreditoMdl;
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
        this.actualizarCredito = this.inicializarActualizarCredito();
    }

    get tForm() {
        return this.actualizarCreditoForm.controls;
    }

    inicializarActualizarCredito(): SolicitudesCreditos {
        return {
            id: '',
            numero: '',
            monto: '',
            plazo: '',
            aceptaTerminos: '',
            estado: '',
            user_id: '',
            empresaComercial_id: '',
            empresaIfis_id: '',
            reporteBuro: '',
            calificacionBuro: '',
            buroValido: '',
            identificacion: '',
            ruc: '',
            rolesPago: '',
            panillaIESS: '',
            created_at: '',
            updated_at: '',
            state: '',
            tomarSolicitud: '',
            concepto: '',
            fechaAprobacion: '',
            documentoAprobacion: '',
        };
    }

    ngOnInit(): void {
        this.actualizarCreditoForm = this._formBuilder.group({
            tomarSolicitud: ['', [Validators.required]],
            estado: ['', [Validators.required]],
            concepto: ['', [Validators.required]],
            fechaAprobacion: ['', [Validators.required]],
            documentoAprobacion: ['', [Validators.required]],
        });
        this.obtenerSolicitudesCreditos();
    }

    ngAfterViewInit() {
        this.iniciarPaginador();
    }

    obtenerSolicitudesCreditos() {
        this._solictudesCreditosService.obtenerSolicitudesCreditos({
            empresaIfis_id: this.usuario.empresa.id,
            estado: ['Confirmado'],
            page_size: this.page_size, page: this.page - 1
        }).subscribe(info => {

            this.collectionSize = info.cont;
            this.listaCreditos = info.info;
        });
    }

    obtenerDetalles(id) {
        this.listaCreditos.filter((value) => {
            if (value._id === id) {
                this.mensaje = '<ul>';
                this.mensaje += '<li>Monto: ' + value.monto + '</li>';
                this.mensaje += '<li>Plazo: ' + value.plazo + '</li>';
                this.mensaje += '<li>Tasa de interés: ' + value.interes + '</li>';
                this.mensaje += '<li>Vigencia: ' + value.vigencia + '</li>';
                this.mensaje += '<ul> ';
                this.abrirModal(this.detalleCreditoMdl);
                return;
            }
        });
    }

    toggleSidebar(name, id): void {
        if (id) {
            this._solictudesCreditosService.obtenersolicitudCredito(id).subscribe((info) => {
                    let {_id, tomarSolicitud, tipoCredito, concepto, estado, documentoAprobacion, fechaAprobacion, ...resto} = info;
                    this.actualizarCredito = {
                        id: _id, tomarSolicitud: tomarSolicitud, tipoCredito: tipoCredito,
                        concepto: concepto, estado: estado,
                        documentoAprobacion: documentoAprobacion, fechaAprobacion: fechaAprobacion
                    };

                    this.actualizarCredito.id = id;
                    this.actualizarCredito.fechaAprobacion = fechaAprobacion != null ? fechaAprobacion : moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
                    this.imagen = '';
                    this.actualizarCreditoFormData.delete('documentoAprobacion');
                },
                (error) => {
                    this.mensaje = 'Error al obtener el crédito';
                    this.abrirModal(this.mensajeModal);
                });
        }
        this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
    }

    estadoSolicitud(event) {
        if (this.actualizarCredito.estado === 'Rechazar') {
            this.actualizarCreditoForm.controls.documentoAprobacion.disable();
        } else {
            this.actualizarCreditoForm.controls.documentoAprobacion.enable();
        }
    }

    actualizarSolicitudCredito() {
        this.submitted = true;
        if (this.actualizarCreditoForm.invalid) {
            return;
        }
        const creditoValores = Object.values(this.actualizarCredito);
        const creditoLlaves = Object.keys(this.actualizarCredito);
        creditoLlaves.map((llaves, index) => {
            if (llaves !== 'documentoAprobacion') {
                if (creditoValores[index]) {
                    this.actualizarCreditoFormData.delete(llaves);
                    this.actualizarCreditoFormData.append(llaves, creditoValores[index]);
                }
            }
        });
        this.cargando = true;
        this._solictudesCreditosService.actualizarSolictudesCreditos(this.actualizarCreditoFormData).subscribe((info) => {
                this.mensaje = 'Crédito actualizado con éxito';
                this.toggleSidebar('actualizar-credito', '');
                this.abrirModal(this.mensajeModal);
                this.obtenerSolicitudesCreditos();
                this.cargando = false;
            },
            (error) => {
                this.mensaje = 'Error al actualizar el crédito';
                this.abrirModal(this.mensajeModal);
                this.cargando = false;
            });
    }

    async subirDocumentoAprobacion(event) {
        if (event.target.files && event.target.files[0]) {
            const imagen = event.target.files[0];
            this.imagen = imagen.name;
            this.actualizarCreditoFormData.delete('documentoAprobacion');
            this.actualizarCreditoFormData.append('documentoAprobacion', imagen, Date.now() + '_' + imagen.name);
        }
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

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    transformarFecha(fecha) {
        const nuevaFecha = this.datePipe.transform(fecha, 'yyyy-MM-dd');
        return nuevaFecha;
    }
}
