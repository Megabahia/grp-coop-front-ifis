import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from '../../auth/helpers/auth.guards';
import { CoreCommonModule } from '../../../@core/common.module';
import { RouterModule } from '@angular/router';
import { Role } from '../../auth/models/role';
import { ContentHeaderModule } from '../../layout/components/content-header/content-header.module';
import { TranslateModule } from '@ngx-translate/core';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { CoreTouchspinModule } from '../../../@core/components/core-touchspin/core-touchspin.module';
import { CoreSidebarModule } from '../../../@core/components/core-sidebar/core-sidebar.module';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { CardSnippetModule } from '../../../@core/components/card-snippet/card-snippet.module';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProspectosClientesListComponent } from './prospectos-clientes/prospectos-clientes-list/prospectos-clientes-list.component';
import { ChartsModule } from 'ng2-charts';
import {FlatpickrModule} from 'angularx-flatpickr';
import { ProspectosClientesEditComponent } from './prospectos-clientes/prospectos-clientes-edit/prospectos-clientes-edit.component';
import { NegociosListComponent } from './clientes/negocios/negocios-list/negocios-list.component';
import { TransaccionesAddComponent as transaccionesNegociosAdd } from './clientes/negocios/transacciones-add/transacciones-add.component';
import { TransaccionesAddComponent as transaccionesPersonasAdd } from './clientes/personas/transacciones-add/transacciones-add.component';
import { TransaccionesListComponent as transaccionesNegociosList } from './clientes/negocios/transacciones-list/transacciones-list.component';
import { TransaccionesListComponent as transaccionesPersonasList } from './clientes/personas/transacciones-list/transacciones-list.component';
import { PersonasListComponent } from './clientes/personas/personas-list/personas-list.component';
import { PersonasParientesComponent } from './clientes/personas/personas-parientes/personas-parientes.component';
import { PersonasEditComponent } from './clientes/personas/personas-edit/personas-edit.component';
import { NegociosEditComponent } from './clientes/negocios/negocios-edit/negocios-edit.component';
import { NegociosLoadComponent } from './clientes/negocios/negocios-load/negocios-load.component';
import { TransaccionesLoadComponent } from './clientes/personas/transacciones-load/transacciones-load.component';

const routes = [
  { path: "", redirectTo: "list", pathMatch: "full" },
  {
    path: "list",
    component: ProspectosClientesListComponent,
    data: { roles: [Role.SuperMonedas] },
    canActivate: [AuthGuard],
    // data: { animation: 'auth' }
  },
  {
    path: "listClientes",
    component: PersonasListComponent,
    data: { roles: [Role.SuperMonedas] },
    canActivate: [AuthGuard],
    // data: { animation: 'auth' }
  },
  {
    path: "listTransacCom",
    component: transaccionesPersonasList,
    data: { roles: [Role.SuperMonedas] },
    canActivate: [AuthGuard],
    // data: { animation: 'auth' }
  },
  {
    path: "addTrans",
    component: transaccionesPersonasAdd,
    data: { roles: [Role.SuperMonedas] },
    canActivate: [AuthGuard],
    // data: { animation: 'auth' }
  },
  {
    path: 'negocios-list',
    component: NegociosListComponent,
    data: { roles: [Role.SuperMonedas] },
    canActivate: [AuthGuard]
    // data: { animation: 'auth' }
  },
  {
    path: 'transacciones-list',
    component: transaccionesNegociosList,
    data: { roles: [Role.SuperMonedas] },
    canActivate: [AuthGuard]
    // data: { animation: 'auth' }
  },
  {
    path: 'transacciones-add',
    component: transaccionesNegociosAdd,
    data: { roles: [Role.SuperMonedas] },
    canActivate: [AuthGuard]
    // data: { animation: 'auth' }
  },
];

@NgModule({
  declarations: [
    ProspectosClientesListComponent,
    ProspectosClientesEditComponent,
    PersonasListComponent,
    PersonasEditComponent,
    PersonasParientesComponent,
    NegociosListComponent,
    NegociosEditComponent,
    NegociosLoadComponent,
    TransaccionesLoadComponent,
    transaccionesNegociosAdd,
    transaccionesPersonasAdd,
    transaccionesPersonasList,
    transaccionesNegociosList,
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
    CommonModule,
    ChartsModule,
    ReactiveFormsModule,
    FlatpickrModule.forRoot(),
  ],
  exports: [
    ProspectosClientesListComponent,
    ProspectosClientesEditComponent,
    PersonasListComponent,
    PersonasEditComponent,
    PersonasParientesComponent,
    NegociosListComponent,
    NegociosEditComponent,
    NegociosLoadComponent,
    TransaccionesLoadComponent,
    transaccionesNegociosAdd,
    transaccionesPersonasAdd,
    transaccionesPersonasList,
    transaccionesNegociosList,
  ]
})
export class MdmModule {}
