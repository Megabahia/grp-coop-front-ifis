import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as XLSX from 'xlsx-js-style';
import moment from 'moment/moment';
import {CargarCreditosPreAprobadosService} from '../creditos-preaprobados/creditos-preaprobados.service';
import {CoreMenuService} from '../../../../../@core/components/core-menu/core-menu.service';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {CobroMonedas} from '../../models/cargar-creditos';
import {Subject} from 'rxjs';
import {SwiperConfigInterface} from 'ngx-swiper-wrapper';

type AOA = any[][];

@Component({
  selector: 'app-micro-creditos',
  templateUrl: './micro-creditos.component.html',
  styleUrls: ['./micro-creditos.component.scss']
})
export class MicroCreditosComponent implements OnInit, OnDestroy {

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
  public archivoMicroCreditos = new FormData();
  public cartList;
  public relatedProducts;
  public productos;
  public producto;
  private _unsubscribeAll: Subject<any>;

  public swiperResponsive: SwiperConfigInterface;

  public cantidadMonedas;
  public usuario;
  public numeroRegistros;
  public inicio;
  public fin;

  public listaArchivosPreAprobados: [] = [];

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

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  abrirModal(modal) {
    this.modalService.open(modal);
  }

  cerrarModal() {
    this.modalService.dismissAll();
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
      tipoCredito: 'micro-credito'
    }).subscribe((info) => {
        this.listaArchivosPreAprobados = info.info;
      },
      (error) => {

      });
  }

  cargarCreditos(event) {
    const archivo = event.target.files[0];
    this.archivoMicroCreditos = new FormData();
    this.archivoMicroCreditos.append('linkArchivo', archivo, archivo.name);
    this.archivoMicroCreditos.append('tamanioArchivo', String(archivo.size / (1000000)));
    this.nombreArchivo = archivo.name;
    this.archivoMicroCreditos.append('empresa_financiera', this.usuario.empresa._id);
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

        this.numeroRegistros = data[0].length - 1;
      };
      reader.readAsBinaryString(target.files[0]);
    }
  }

  cargar() {
    console.log('entra');
    this.submitted = true;
    if (!this.archivoMicroCreditos.get('linkArchivo')) {
      this.archivo = false;
      return;
    }
    this.archivoMicroCreditos.delete('estado');
    this.archivoMicroCreditos.append('estado', 'Pendiente Carga');
    this.archivoMicroCreditos.delete('fechaCargaArchivo');
    this.archivoMicroCreditos.append('fechaCargaArchivo', String(moment().format('YYYY-MM-DD')));
    this.archivoMicroCreditos.delete('registrosCargados');
    this.archivoMicroCreditos.append('registrosCargados', String(this.numeroRegistros));
    this.archivoMicroCreditos.delete('usuarioCargo');
    this.archivoMicroCreditos.append('usuarioCargo', this.usuario.persona.nombres);
    this.archivoMicroCreditos.delete('user_id');
    this.archivoMicroCreditos.append('user_id', this.usuario.id);
    this.archivoMicroCreditos.append('tipoCredito', 'micro-credito');
    this._cargarCreditosPreAprobados.crearArchivoPreAprobados(
      this.archivoMicroCreditos
    ).subscribe(info => {
      this.mensaje = 'Archivo cargado con éxito';
      this.abrirModal(this.mensajeModal);
      this.obtenerListaArchivosPreAprobados();
    });
  }

  subirArchivoPreAprobado(id) {
    this._cargarCreditosPreAprobados.subirMicroCreditosPreAprobados(id).subscribe(info => {
      this.obtenerListaArchivosPreAprobados();
      this.mensaje = `${info.mensaje} <br> correctos: ${info.correctos} <br>
                        incorrectos: ${info.incorrectos} <br> errores: ${info.errores}`;
      this.abrirModal(this.mensajeModal);
    });
  }

  eliminarArchivoPreAprobado(id) {
    this._cargarCreditosPreAprobados.eliminarArchivosPreAprobados(id).subscribe(info => {
      this.obtenerListaArchivosPreAprobados();
      this.mensaje = 'Se elimino correctamente.';
      this.abrirModal(this.mensajeModal);
    });
  }

}
