import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CoreConfigService} from '@core/services/config.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {RegistroService} from './registro.service';
import {Role} from '../../../auth/models/role';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {
  //  Public
  public coreConfig: any;
  public registerForm: FormGroup;
  public loading = false;
  public submitted = false;
  public returnUrl: string;
  public error = '';
  public passwordTextType: boolean;
  public confirmPasswordTextType: boolean;
  public passwordSimilar: boolean;

  // Private
  private _unsubscribeAll: Subject<any>;
  public captcha: boolean;
  public siteKey: string;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private _registroService: RegistroService,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.siteKey = '6LfPwgAkAAAAAF6z9L1DEChrBeq7dMTigroN4eq_';
    this._unsubscribeAll = new Subject();

    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        menu: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        customizer: false,
        enableLocalStorage: false
      }
    };
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  /**
   * Toggle password
   */
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  toggleConfirmPasswordTextType() {
    this.confirmPasswordTextType = !this.confirmPasswordTextType;
  }

  registrarUsuario() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid || !this.passwordSimilar || !this.captcha) {
      return;
    }

    // Login

    this._registroService.registrarUsuario(
      {
        password: this.f.password.value,
        roles: Role.SuperMonedas,
        email: this.f.correo.value,
        estado: 1
      }
    ).subscribe((info) => {
        this.error = null;
        this.loading = true;
        localStorage.setItem('grpIfisUser', JSON.stringify(info));
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      },
      (error) => {
        console.log(error);
        // this.error = error.error.password;
      });
    // redirect to home page

  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.registerForm = this._formBuilder.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      terminos: [false, [Validators.requiredTrue]]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';

    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });
  }

  compararPassword() {
    if (this.f.password.value === this.f.confirmPassword.value) {
      this.passwordSimilar = true;
    } else {
      this.passwordSimilar = false;
    }
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  captchaValidado(evento) {
    this.captcha = true;
  }
}
