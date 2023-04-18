import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitudEmpComponent } from './vistas/solicitud/solicitud.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreCommonModule } from '@core/common.module';
import { RouterModule } from '@angular/router';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { TranslateModule } from '@ngx-translate/core';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { FormsModule } from '@angular/forms';
import { CoreTouchspinModule } from '@core/components/core-touchspin/core-touchspin.module';
import { CoreSidebarModule } from '@core/components';
import { AuthGuard } from '../../auth/helpers/auth.guards';
import { Role } from '../../auth/models/role';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { CardSnippetModule } from '../../../@core/components/card-snippet/card-snippet.module';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
const routes = [
  { path: '', redirectTo: 'solicitud', pathMatch: 'full' },
  {
    path: 'solicitud',
    component: SolicitudEmpComponent,
    data: { roles: [Role.SuperMonedas] },
    canActivate: [AuthGuard]
    // data: { animation: 'auth' }
  },



];

@NgModule({
  declarations: [
    SolicitudEmpComponent,

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
    ShareButtonsModule
  ],
  exports: [

    SolicitudEmpComponent,
]
})
export class OpCreditosEmpleadosModule { }
