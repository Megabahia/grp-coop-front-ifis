import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import { ContentHeaderModule } from '../../layout/components/content-header/content-header.module';
import { TranslateModule } from '@ngx-translate/core';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { CoreCommonModule } from '../../../@core/common.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CoreTouchspinModule } from '../../../@core/components/core-touchspin/core-touchspin.module';
import { CoreSidebarModule } from '../../../@core/components/core-sidebar/core-sidebar.module';
import { RecuperarPassComponent } from './recuperar-pass/recuperar-pass.component';
import { RegistroComponent } from './registro/registro.component';
import { AuthGuard } from '../../auth/helpers/auth.guards';
import { ReseteoPasswordComponent } from './reseteo-password/reseteo-password.component';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { PerfilUsuarioComponent } from './perfil-usuario/perfil-usuario.component';
import { Role } from 'app/auth/models';
import {NgxCaptchaModule} from 'ngx-captcha';

const routes = [
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { animation: 'auth' }
  },
  {
    path: 'registro',
    component: RegistroComponent,
    data: { animation: 'auth' }
  },
  {
    path: 'recuperarPass',
    component: RecuperarPassComponent,
    data: { animation: 'auth' }
  },
  {
    path: 'reseteoPassword',
    component: ReseteoPasswordComponent,
    data: { animation: 'auth' }
  },
  {
    path: 'perfil',
    component: PerfilUsuarioComponent,
    data: { roles: [Role.SuperMonedas, Role.Autonomo, Role.Empleado] },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [LoginComponent, RecuperarPassComponent, RegistroComponent, ReseteoPasswordComponent],
  imports: [
    RouterModule.forChild(routes),
    ContentHeaderModule,
    TranslateModule,
    CoreCommonModule,
    SwiperModule,
    FormsModule,
    CoreTouchspinModule,
    CoreSidebarModule,
    NgbModule,
    Ng2FlatpickrModule,
    NgxCaptchaModule,
  ]
})
export class CenterModule { }
