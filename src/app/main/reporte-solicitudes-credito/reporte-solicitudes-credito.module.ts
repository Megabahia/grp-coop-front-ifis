import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from '../../auth/helpers/auth.guards';
import { CoreCommonModule } from '../../../@core/common.module';
import { RouterModule } from '@angular/router';
import { Role } from '../../auth/models/role';
import { ContentHeaderModule } from '../../layout/components/content-header/content-header.module';
import { TranslateModule } from '@ngx-translate/core';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { FormsModule } from '@angular/forms';
import { CoreTouchspinModule } from '../../../@core/components/core-touchspin/core-touchspin.module';
import { CoreSidebarModule } from '../../../@core/components/core-sidebar/core-sidebar.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { CardSnippetModule } from '../../../@core/components/card-snippet/card-snippet.module';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import {ListarComponent as ReporteSolicitudesListar} from './vistas/listar/listar.component';

const routes = [
  { path: '', redirectTo: 'listar', pathMatch: 'full' },
  {
    path: 'listar',
    component: ReporteSolicitudesListar,
    data: { roles: [Role.SuperMonedas] },
    canActivate: [AuthGuard]
    // data: { animation: 'auth' }
  },

];


@NgModule({
  declarations: [
    ReporteSolicitudesListar
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
    ReporteSolicitudesListar
  ]
})
export class ReporteSolicitudesCreditoModule { }
