import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CoreMenuService } from '@core/components/core-menu/core-menu.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'app/auth/models';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { Subject } from 'rxjs';
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

  // public
  public contentHeader: object;
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
    this.productos = {
      cont: 0,
      info: []

    }
  }

  ngOnInit(): void {
    this._principalService.obtenerCantidadMonedas(this.usuario.id).subscribe(info => {
      this.cantidadMonedas = info.saldo;
    });
    this._principalService.obtenerProductosMostrar(
      {
        tipo: "premios"
      }
    ).subscribe(info => {
      this.productos = info;
      this.swiperResponsive = {
        slidesPerView: 3,
        spaceBetween: 50,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        breakpoints: {
          1024: {
            slidesPerView: 3,
            spaceBetween: 40
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 30
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 20
          },
          320: {
            slidesPerView: 1,
            spaceBetween: 10
          }
        }
      };
    });
  }
  obtenerProducto(id) {
    this._principalService.obtenerProducto(id).subscribe(info => {
      this.producto = info;
      this.modalService.open(this.DetalleProducto, {
        centered: true,
        size: 'lg'
      });
    })
  }

  comprarProducto() {
    this.modalService.dismissAll();
    this.modalService.open(this.CanjearProducto, {
      centered: true,
      size: 'lg'
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
