import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CoreMenuService } from '@core/components/core-menu/core-menu.service';
import { NgbModal, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'app/auth/models';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { Subject } from 'rxjs';
import { CobroMonedas } from '../../models/superMonedas';
import { PrincipalService } from './principal.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'ecommerce-application' }
})
export class PrincipalComponent implements OnInit {
  @ViewChild('DetalleProducto') DetalleProducto;
  @ViewChild('CanjearProducto') CanjearProducto;
  @ViewChild('confirmarPreautorizacionMdl') confirmarPreautorizacionMdl;
  @ViewChild('mensajeModal') mensajeModal;
  @ViewChild(NgbPagination) paginator: NgbPagination;


  // public
  public page = 1;
  public page_size: any = 10;
  public maxSize;
  public collectionSize;
  public contentHeader: object;
  public cobroMonedas: CobroMonedas;
  public listaCobros;
  public idCobro = "";
  public mensaje = "";
  public wishlist;
  public cartList;
  public relatedProducts;
  public productos;
  public producto;
  private _unsubscribeAll: Subject<any>;

  public swiperResponsive: SwiperConfigInterface;

  public cantidadMonedas;
  public usuario: User;

  constructor(
    private _principalService: PrincipalService,
    private _coreMenuService: CoreMenuService,
    private modalService: NgbModal,
    
  ) {
    this._unsubscribeAll = new Subject();
    this.usuario = this._coreMenuService.grpIfisUser;
    this.cobroMonedas = {
      codigoCobro: "",
      correo: "",
      identificacion: "",
      monto: ""
    }
  }

  ngOnInit(): void {

    this.obtenerListaCobros();
  }
  obtenerListaCobros() {
    this._principalService.obtenerListaCobros({
      ...this.cobroMonedas, page_size: this.page_size, page: this.page - 1
    }).subscribe(info => {

      this.collectionSize = info.cont;
      this.listaCobros = info.info;
    });
  }

  comprarProducto() {
    this.modalService.dismissAll();
    this.modalService.open(this.CanjearProducto, {
      centered: true,
      size: 'lg'
    });
  }
  preautorizarCobro() {
    this.cerrarModal();
    this._principalService.preautorizarCobro({
      id: this.idCobro,
      estado: "Pre-autorizado",
      user_id:this.usuario.id
    }).subscribe((info) => {
      this.mensaje = "Cobro Pre-autorizado"
      this.abrirModal(this.mensajeModal);
      this.obtenerListaCobros();
    },
      (error) => {
        let errores = Object.values(error);
        let llaves = Object.keys(error);
        this.mensaje = "";
        errores.map((infoErrores, index) => {
          this.mensaje += llaves[index] + ": " + infoErrores + "<br>";
        });
        this.abrirModal(this.mensajeModal);
      })
  }
  procesarCobro(id) {
    this.idCobro = id;
    this.abrirModal(this.confirmarPreautorizacionMdl);
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
