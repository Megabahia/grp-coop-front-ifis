import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {CoreMenuService} from '@core/components/core-menu/core-menu.service';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {SwiperConfigInterface} from 'ngx-swiper-wrapper';
import {Subject} from 'rxjs';
import {CobroMonedas} from '../../models/cargar-creditos';
import * as XLSX from 'xlsx-js-style';

type AOA = any[][];
import moment from 'moment';
import {CargarCreditosPreAprobadosService} from './creditos-preaprobados.service';

@Component({
  selector: 'app-cargar-creditos-preaprobados',
  templateUrl: './creditos-preaprobados.component.html',
  styleUrls: ['./creditos-preaprobados.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {class: 'ecommerce-application'}
})
export class CargarCreditosPreAprobadosComponent implements OnInit {
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
  public submitted = false;
  public archivo = true;
  public nombreArchivo = 'Seleccionar archivo';
  public mensaje = '';
  public wishlist;
  public nuevaImagen = new FormData();
  public cartList;
  public relatedProducts;
  public productos;
  public producto;
  private _unsubscribeAll: Subject<any>;

  public swiperResponsive: SwiperConfigInterface;

  public cantidadMonedas;
  public usuario;
  public listaArchivosPreAprobados = [];
  public numeroRegistros;
  public inicio;
  public fin;

  constructor(
    private _cargarCreditosPreAprobados: CargarCreditosPreAprobadosService,
    private _coreMenuService: CoreMenuService,
    private modalService: NgbModal,
  ) {
    this._unsubscribeAll = new Subject();
    this.usuario = this._coreMenuService.grpIfisUser;
  }

  ngOnInit(): void {
    this.obtenerListaArchivosPreAprobados();
  }

  cargarCreditos(event) {
    const archivo = event.target.files[0];
    this.nuevaImagen = new FormData();
    this.nuevaImagen.append('linkArchivo', archivo, archivo.name);
    this.nuevaImagen.append('tamanioArchivo', String(archivo.size / (1000000)));
    this.nombreArchivo = archivo.name;
    this.nuevaImagen.append('empresa_financiera', this.usuario.empresa._id);
    this.archivo = true;
    const target: DataTransfer = <DataTransfer>event.target;
    const data = [];
    if (target.files.length === 1) {
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        /* save data */
        data.push(<AOA>XLSX.utils.sheet_to_json(ws, {header: 1}));

        // Recuep
        // data[0].map((item, index) => {
        //   if (index > 0) {
        //     if(item[8] != this.empresaIfi.ruc){
        //       this.mensaje = "No coicide el ruc de la empresa Ifi con la seleccionada."
        //       this.abrirModal(this.mensajeModal);
        //     }
        //     console.log(item[8]);
        //   }
        // });
        this.numeroRegistros = data[0].length - 1;
      };
      reader.readAsBinaryString(target.files[0]);
    }
  }

  cargar() {
    this.submitted = true;
    if (!this.nuevaImagen.get('linkArchivo')) {
      this.archivo = false;
      return;
    }
    this.nuevaImagen.delete('estado');
    this.nuevaImagen.append('estado', 'Pendiente Carga');
    this.nuevaImagen.delete('fechaCargaArchivo');
    this.nuevaImagen.append('fechaCargaArchivo', String(moment().format('YYYY-MM-DD')));
    this.nuevaImagen.delete('registrosCargados');
    this.nuevaImagen.append('registrosCargados', String(this.numeroRegistros));
    this.nuevaImagen.delete('usuarioCargo');
    this.nuevaImagen.append('usuarioCargo', this.usuario.persona.nombres);
    this.nuevaImagen.delete('user_id');
    this.nuevaImagen.append('user_id', this.usuario.id);
    this.nuevaImagen.append('tipoCredito', 'PreAprobado');
    this._cargarCreditosPreAprobados.crearArchivoPreAprobados(
      this.nuevaImagen
    ).subscribe(info => {
      this.mensaje = 'Archivo cargado con éxito';
      this.abrirModal(this.mensajeModal);
      this.obtenerListaArchivosPreAprobados();
    });
  }

  eliminarArchivoPreAprobado(id) {
    this._cargarCreditosPreAprobados.eliminarArchivosPreAprobados(id).subscribe(info => {
      this.obtenerListaArchivosPreAprobados();
      this.mensaje = 'Se elimino correctamente.';
      this.abrirModal(this.mensajeModal);
    });
  }

  subirArchivoPreAprobado(id) {
    this._cargarCreditosPreAprobados.subirArchivosPreAprobados(id).subscribe(info => {
      this.obtenerListaArchivosPreAprobados();
      this.mensaje = `${info.mensaje} <br> correctos: ${info.correctos} <br>
                        incorrectos: ${info.incorrectos} <br> errores: ${info.errores}`;
      this.abrirModal(this.mensajeModal);
    });
  }

  obtenerListaArchivosPreAprobados() {
    this._cargarCreditosPreAprobados.obtenerListaArchivosPreAprobados({
      page_size: 10,
      page: 0,
      minimoCarga: this.inicio,
      maximoCarga: this.fin,
      minimoCreacion: '',
      maximaCreacion: '',
      user_id: '',
      campania: '',
      tipoCredito: 'PreAprobado'
    }).subscribe((info) => {
        this.listaArchivosPreAprobados = info.info;
      },
      (error) => {

      });
  }

  abrirModal(modal) {
    this.modalService.open(modal);
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
