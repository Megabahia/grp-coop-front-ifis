import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreMenuService } from '@core/components/core-menu/core-menu.service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { NgbModal, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'app/auth/models';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { Subject } from 'rxjs';
import { ActualizarCredito } from '../../models/creditos';
import { SolicitudPreService } from './solicitud.service';

@Component({
  selector: 'app-solicitud-pre',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'ecommerce-application' }
})
export class SolicitudPreComponent implements OnInit {
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
  public actualizarCredito: ActualizarCredito;
  public listaCreditos;
  public submitted = false;
  public idCobro = "";
  public mensaje = "";
  public wishlist;
  public cartList;
  public relatedProducts;
  public productos;
  public producto;
  private _unsubscribeAll: Subject<any>;
  public actualizarCreditoForm: FormGroup;

  public swiperResponsive: SwiperConfigInterface;

  public cantidadMonedas;
  public usuario;

  constructor(
    private _formBuilder: FormBuilder,
    private _solicitudPreService: SolicitudPreService,
    private _coreMenuService: CoreMenuService,
    private modalService: NgbModal,
    private _coreSidebarService: CoreSidebarService,

  ) {
    this._unsubscribeAll = new Subject();
    this.usuario = this._coreMenuService.grpIfisUser;
    this.actualizarCredito = this.inicializarActualizarCredito();
  }
  get tForm() {
    return this.actualizarCreditoForm.controls;
  }
  inicializarActualizarCredito(): ActualizarCredito {
    return {
      concepto: "",
      estado: "",
      id: "",
      tomarSolicitud: ""
    }
  }
  ngOnInit(): void {
    this.actualizarCreditoForm = this._formBuilder.group({
      tomarSolicitud: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      concepto: ['', [Validators.required]],
    });
    this.obtenerListaSolicitudes();
  }
  ngAfterViewInit() {
    this.iniciarPaginador();
  }
  obtenerListaSolicitudes() {
    this._solicitudPreService.obtenerListaSolicitudes({
      tipoPersona: "",
      empresa_financiera: this.usuario.empresa.id,
      tipoCredito:"Preaprobado",
      page_size: this.page_size, page: this.page - 1
    }).subscribe(info => {

      this.collectionSize = info.cont;
      this.listaCreditos = info.info;
    });
  }
  obtenerDetalles(id) {
    this.listaCreditos.filter((value) => {
      if (value._id == id) {
        this.mensaje = "<ul>";
        this.mensaje += "<li>Monto: " + value.monto + "</li>";
        this.mensaje += "<li>Plazo: " + value.plazo + "</li>";
        this.mensaje += "<li>Tasa de interés: " + value.interes + "</li>";
        this.mensaje += "<li>Vigencia: " + value.vigencia + "</li>";
        this.mensaje += "<ul> ";
        this.abrirModal(this.detalleCreditoMdl);
        return;
      }
    })
  }
  toggleSidebar(name, id): void {
    if (id) {
      this._solicitudPreService.obtenerCredito(id).subscribe((info) => {
        this.actualizarCredito = info;
        this.actualizarCredito.id = id;
      },
        (error) => {
          this.mensaje = "Error al obtener el crédito";
          this.abrirModal(this.mensajeModal);
        });
    }
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }
  actualizarSolicitudCredito() {
    this.submitted = true;
    if (this.actualizarCreditoForm.invalid) {
      return;
    }
    this._solicitudPreService.actualizarCredito(this.actualizarCredito).subscribe((info) => {
      this.mensaje = "Crédito actualizado con éxito";
      this.toggleSidebar('actualizar-credito', '');
      this.abrirModal(this.mensajeModal);
      this.obtenerListaSolicitudes();
    },
      (error) => {
        this.mensaje = "Error al actualizar el crédito";
        this.abrirModal(this.mensajeModal);
      });
  }
  iniciarPaginador() {
    this.paginator.pageChange.subscribe(() => {
      this.obtenerListaSolicitudes();
    });
  }
  abrirModal(modal) {
    this.modalService.open(modal)
  }
  cerrarModal() {
    this.modalService.dismissAll();
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
