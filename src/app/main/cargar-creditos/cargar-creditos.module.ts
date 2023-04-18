import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CargarCreditosPreAprobadosComponent} from './vistas/creditos-preaprobados/creditos-preaprobados.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CoreCommonModule} from '@core/common.module';
import {RouterModule} from '@angular/router';
import {ContentHeaderModule} from 'app/layout/components/content-header/content-header.module';
import {TranslateModule} from '@ngx-translate/core';
import {SwiperModule} from 'ngx-swiper-wrapper';
import {FormsModule} from '@angular/forms';
import {CoreTouchspinModule} from '@core/components/core-touchspin/core-touchspin.module';
import {CoreSidebarModule} from '@core/components';
import {AuthGuard} from '../../auth/helpers/auth.guards';
import {Role} from '../../auth/models/role';
import 'flatpickr/dist/flatpickr.css'; // you may need to adjust the css import depending on your build tool
import {FlatpickrModule} from 'angularx-flatpickr';
import {Ng2FlatpickrModule} from 'ng2-flatpickr';
import {CardSnippetModule} from '../../../@core/components/card-snippet/card-snippet.module';
import {ShareButtonsModule} from 'ngx-sharebuttons/buttons';
import {ShareIconsModule} from 'ngx-sharebuttons/icons';
import {MicroCreditosComponent} from './vistas/micro-creditos/micro-creditos.component';

const routes = [
  {path: '', redirectTo: 'inicio', pathMatch: 'full'},
  {
    path: 'preaprobados',
    component: CargarCreditosPreAprobadosComponent,
    data: {roles: [Role.SuperMonedas]},
    canActivate: [AuthGuard]
    // data: { animation: 'auth' }
  },
  {
    path: 'micro-creditos/pre-aprobados',
    component: MicroCreditosComponent,
    data: {roles: [Role.SuperMonedas]},
    canActivate: [AuthGuard]
    // data: { animation: 'auth' }
  },


];

@NgModule({
  declarations: [
    CargarCreditosPreAprobadosComponent,
    MicroCreditosComponent,
  ],
  imports: [
    CoreCommonModule,
    RouterModule.forChild(routes),
    ContentHeaderModule,
    TranslateModule,
    SwiperModule,
    FormsModule,
    CoreTouchspinModule,
    CoreSidebarModule,
    NgbModule,
    Ng2FlatpickrModule,
    CardSnippetModule,
    ShareIconsModule,
    ShareButtonsModule,
    FlatpickrModule.forRoot()
  ],
  exports: [

    CargarCreditosPreAprobadosComponent,
  ]
})
export class CargarCreditosModule {
}
