import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { ClientesService, Pariente } from "../clientes.service";

import * as moment from "moment";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ParamService } from "app/services/param/param.service";

@Component({
  selector: "app-personas-parientes",
  templateUrl: "./personas-parientes.component.html",
})
export class PersonasParientesComponent implements OnInit {
  @Output() volver = new EventEmitter<string>();
  @ViewChild("mensajeModal") mensajeModal;
  @Input() idPariente;
  @Input() idCliente;
  pariente: Pariente;
  submitted = false;
  //FORMS
  datosParientesForm: FormGroup;
  //--------------------------------------
  numRegex = /^-?\d*[.,]?\d{0,2}$/;

  //mensaje modal
  mensaje = "";

  tipoParientesOpciones;
  generoOpciones;
  nacionalidadOpciones;
  paisesOpciones;
  provinciaNacimientoOpciones;
  ciudadNacimientoOpciones;
  provinciaResidenciaOpciones;
  ciudadResidenciaOpciones;
  nivelEstudiosOpciones;
  profesionOpciones;
  provinciaTrabajoOpciones;
  ciudadTrabajoOpciones;
  estadoCivilOpciones;
  estadoOpcion;
  constructor(
    private clientesService: ClientesService,
    private paramService: ParamService,
    private _formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {
    this.pariente = clientesService.inicializarPariente();
  }

  async ngOnInit() {
    this.datosParientesForm = this._formBuilder.group({
      tipoPariente: ["", [Validators.required]],
      cedula: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
      nombres: ["", [Validators.required]],
      apellidos: ["", [Validators.required]],
      genero: ["", [Validators.required]],
      nacionalidad: ["", [Validators.required]],
      fechaNacimiento: ["", [Validators.required]],
      edad: ["", [Validators.required]],
      paisNacimiento: ["", [Validators.required]],
      provinciaNacimiento: ["", [Validators.required]],
      ciudadNacimiento: ["", [Validators.required]],
      estadoCivil: ["", [Validators.required]],
      paisResidencia: ["", [Validators.required]],
      provinciaResidencia: ["", [Validators.required]],
      ciudadResidencia: ["", [Validators.required]],
      callePrincipal: ["", [Validators.required]],
      numero: ["", [Validators.required]],
      calleSecundaria: ["", [Validators.required]],
      edificio: ["", [Validators.required]],
      piso: ["", [Validators.required]],
      departamento: ["", [Validators.required]],
      telefonoDomicilio: [
        "",
        [Validators.required, Validators.pattern("^[0-9]*$")],
      ],
      telefonoOficina: [
        "",
        [Validators.required, Validators.pattern("^[0-9]*$")],
      ],
      celularPersonal: [
        "",
        [Validators.required, Validators.pattern("^[0-9]*$")],
      ],
      celularOficina: [
        "",
        [Validators.required, Validators.pattern("^[0-9]*$")],
      ],
      whatsappPersonal: [
        "",
        [Validators.required, Validators.pattern("^[0-9]*$")],
      ],
      whatsappSecundario: [
        "",
        [Validators.required, Validators.pattern("^[0-9]*$")],
      ],
      correoPersonal: ["", [Validators.required]],
      correoTrabajo: ["", [Validators.required]],
      googlePlus: ["", [Validators.required]],
      twitter: ["", [Validators.required]],
      facebook: ["", [Validators.required]],
      instagram: ["", [Validators.required]],
      nivelEstudios: ["", [Validators.required]],
      profesion: ["", [Validators.required]],
      lugarTrabajo: ["", [Validators.required]],
      paisTrabajo: ["", [Validators.required]],
      provinciaTrabajo: ["", [Validators.required]],
      ciudadTrabajo: ["", [Validators.required]],
      mesesUltimoTrabajo: [
        0,
        [Validators.required, Validators.pattern("^[0-9]*$")],
      ],
      mesesTotalTrabajo: [
        0,
        [Validators.required, Validators.pattern("^[0-9]*$")],
      ],
      ingresosPromedioMensual: [
        0,
        [Validators.required, Validators.pattern(this.numRegex)],
      ],
      gastosPromedioMensual: [
        0,
        [Validators.required, Validators.pattern(this.numRegex)],
      ],
    });
  }

  //GETS-------
  get f() {
    return this.datosParientesForm.controls;
  }
  //------------

  async ngAfterViewInit() {
    this.obtenerTipoParientesOpciones();
    this.obtenerGeneroOpciones();
    this.obtenerNacionalidadOpciones();
    this.obtenerPaisOpciones();
    this.obtenerNivelEstudiosOpciones();
    this.obtenerNivelProfesionOpciones();
    this.obtenerEstadoCivilOpciones();
    if (this.idPariente != 0) {
      await this.clientesService
        .obtenerPariente(this.idPariente)
        .subscribe((info) => {
          this.pariente = info;
          this.estadoOpcion = info.estado == "Activo" ? 1 : 0;
          this.pariente.estado = info.estado;
          this.obtenerProvinciasNacimiento();
          this.obtenerCiudadNacimiento();
          this.obtenerProvinciasResidencia();
          this.obtenerCiudadResidencia();
          this.obtenerProvinciasTrabajo();
          this.obtenerCiudadTrabajo();
        });
    } else {
      this.pariente = this.clientesService.inicializarPariente();
    }
    this.pariente.cliente = this.idCliente;
  }
  async obtenerTipoParientesOpciones() {
    await this.paramService
      .obtenerListaPadres("TIPO_PARIENTE")
      .subscribe((info) => {
        this.tipoParientesOpciones = info;
      });
  }
  async obtenerGeneroOpciones() {
    await this.paramService.obtenerListaPadres("GENERO").subscribe((info) => {
      this.generoOpciones = info;
    });
  }
  async obtenerNacionalidadOpciones() {
    await this.paramService
      .obtenerListaPadres("NACIONALIDAD")
      .subscribe((info) => {
        this.nacionalidadOpciones = info;
      });
  }
  async obtenerPaisOpciones() {
    await this.paramService.obtenerListaPadres("PAIS").subscribe((info) => {
      this.paisesOpciones = info;
    });
  }
  async obtenerProvinciasNacimiento() {
    await this.paramService
      .obtenerListaHijos(this.pariente.paisNacimiento, "PAIS")
      .subscribe((info) => {
        this.provinciaNacimientoOpciones = info;
      });
  }
  async obtenerCiudadNacimiento() {
    await this.paramService
      .obtenerListaHijos(this.pariente.provinciaNacimiento, "PROVINCIA")
      .subscribe((info) => {
        this.ciudadNacimientoOpciones = info;
      });
  }
  async obtenerProvinciasResidencia() {
    await this.paramService
      .obtenerListaHijos(this.pariente.paisResidencia, "PAIS")
      .subscribe((info) => {
        this.provinciaResidenciaOpciones = info;
      });
  }
  async obtenerCiudadResidencia() {
    await this.paramService
      .obtenerListaHijos(this.pariente.provinciaResidencia, "PROVINCIA")
      .subscribe((info) => {
        this.ciudadResidenciaOpciones = info;
      });
  }
  async obtenerNivelEstudiosOpciones() {
    await this.paramService
      .obtenerListaPadres("NIVEL_ESTUDIOS")
      .subscribe((info) => {
        this.nivelEstudiosOpciones = info;
      });
  }
  async obtenerNivelProfesionOpciones() {
    await this.paramService
      .obtenerListaPadres("PROFESION")
      .subscribe((info) => {
        this.profesionOpciones = info;
      });
  }
  async obtenerProvinciasTrabajo() {
    await this.paramService
      .obtenerListaHijos(this.pariente.paisTrabajo, "PAIS")
      .subscribe((info) => {
        this.provinciaTrabajoOpciones = info;
      });
  }
  async obtenerCiudadTrabajo() {
    await this.paramService
      .obtenerListaHijos(this.pariente.provinciaTrabajo, "PROVINCIA")
      .subscribe((info) => {
        this.ciudadTrabajoOpciones = info;
      });
  }
  async obtenerEstadoCivilOpciones() {
    await this.paramService
      .obtenerListaPadres("ESTADO_CIVIL")
      .subscribe((info) => {
        this.estadoCivilOpciones = info;
      });
  }
  async calcularEdad() {
    this.pariente.edad = moment().diff(this.pariente.fechaNacimiento, "years");
  }
  regresar() {
    this.volver.emit();
  }
  async cambiarEstado() {
    this.pariente.estado = this.estadoOpcion == 1 ? "Activo" : "Inactivo";
  }
  async guardarPariente() {
    this.submitted = true;
    if (this.datosParientesForm.invalid) {
      return;
    }
    if (this.idPariente != 0) {
      await this.clientesService
        .actualizarPariente(this.idPariente, this.pariente)
        .subscribe(
          (info) => {
            this.regresar();
          },
          (error) => {
            let errores = Object.values(error);
            let llaves = Object.keys(error);
            this.mensaje = "";
            errores.map((infoErrores, index) => {
              this.mensaje += llaves[index] + ": " + infoErrores + "<br>";
            });
            this.abrirModal(this.mensajeModal);
          }
        );
    } else {
      await this.clientesService.crearPariente(this.pariente).subscribe(
        (info) => {
          this.regresar();
        },
        (error) => {
          let errores = Object.values(error);
          let llaves = Object.keys(error);
          this.mensaje = "";
          errores.map((infoErrores, index) => {
            this.mensaje += llaves[index] + ": " + infoErrores + "<br>";
          });
          this.abrirModal(this.mensajeModal);
        }
      );
    }
  }
  abrirModal(modal) {
    this.modalService.open(modal);
  }
  cerrarModal() {
    this.modalService.dismissAll();
  }
}
