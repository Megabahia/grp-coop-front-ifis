import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ParamService } from '../../../../services/param/param.service';
import { Prospecto, ProspectosService } from '../prospectos.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-prospectos-clientes-edit',
  templateUrl: './prospectos-clientes-edit.component.html',
})
export class ProspectosClientesEditComponent implements OnInit {
  @ViewChild('eliminarImagenMdl') eliminarImagenMdl;
  @ViewChild('eliminarProspectoMdl') eliminarProspectoMdl;
  @Input() idUsuario;
  @Input() confirmProspectoOpciones;
  prospecto: Prospecto = {
    nombres: "",
    apellidos: "",
    telefono: "",
    tipoCliente: "",
    whatsapp: "",
    facebook: "",
    twitter: "",
    instagram: "",
    correo1: "",
    correo2: "",
    ciudad: "",
    canal: "",
    codigoProducto: "",
    nombreProducto: "",
    precio: 0,
    tipoPrecio: "",
    nombreVendedor: "",
    confirmacionProspecto: "",
    imagen: "",
  }
  urlImagen;
  constructor(
    private prospectosService: ProspectosService,
    private globalParam: ParamService,
    private modalService: NgbModal,

  ) { }

  ngOnInit(): void {
    this.prospectosService.obtenerProspecto(this.idUsuario).subscribe((info) => {
      this.prospecto = info;
      this.urlImagen = info.imagen;
    });
  }
  obtenerURLImagen(url) {
    return this.globalParam.obtenerURL(url);
  }
  async ngAfterViewInit() {

  }
  async subirImagen(event) {
    let imagen = event.target.files[0];
    let imagenForm = new FormData();
    imagenForm.append('imagen', imagen, imagen.name);
    this.prospectosService.insertarImagen(this.idUsuario, imagenForm).subscribe((data) => {
      this.urlImagen = data.imagen;
    });

  }
  abrirModalEliminarImagen() {
    this.abrirModal(this.eliminarImagenMdl);
  }
  abrirModalEliminarProspecto() {
    this.abrirModal(this.eliminarProspectoMdl);

  }
  eliminarImagen() {
    this.prospectosService.insertarImagen(this.idUsuario, { imagen: null }).subscribe((data) => {
      this.urlImagen = data.imagen;
      this.cerrarModal();
    });
  }

  async actualizarProspecto() {
    this.prospectosService.actualizarProspecto(this.idUsuario, this.prospecto.confirmacionProspecto).subscribe(() => {
      window.location.href = '/prospectos-clientes/list';
    });
  }
  eliminarProspecto() {

    this.prospectosService.eliminarProspecto(this.idUsuario).subscribe((info) => {
      window.location.href = '/prospectos-clientes/list';
    });

  }
  abrirModal(modal) {
    this.modalService.open(modal)
  }
  cerrarModal() {
    this.modalService.dismissAll();
  }

}
