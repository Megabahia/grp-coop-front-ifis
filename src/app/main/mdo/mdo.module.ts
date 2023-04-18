import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthGuard } from "../../auth/helpers/auth.guards";
import { CoreCommonModule } from "../../../@core/common.module";
import { RouterModule } from "@angular/router";
import { Role } from "../../auth/models/role";
import { ContentHeaderModule } from "../../layout/components/content-header/content-header.module";
import { TranslateModule } from "@ngx-translate/core";
import { SwiperModule } from "ngx-swiper-wrapper";
import { CoreTouchspinModule } from "../../../@core/components/core-touchspin/core-touchspin.module";
import { CoreSidebarModule } from "../../../@core/components/core-sidebar/core-sidebar.module";
import { Ng2FlatpickrModule } from "ng2-flatpickr";
import { CardSnippetModule } from "../../../@core/components/card-snippet/card-snippet.module";
import { ShareIconsModule } from "ngx-sharebuttons/icons";
import { ShareButtonsModule } from "ngx-sharebuttons/buttons";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { ChartsModule } from "ng2-charts";
import { FlatpickrModule } from "angularx-flatpickr";
import { CrosselingComponent } from "./crosseling/crosseling.component";
import { RefilComponent } from "./refil/refil.component";
import { NuevosProdComponent } from "./nuevos-prod/nuevos-prod.component";
import { GenerarComponent } from "./generar/generar.component";

const routes = [
  { path: "", redirectTo: "list", pathMatch: "full" },
  {
    path: "list",
    component: CrosselingComponent,
    data: { roles: [Role.SuperMonedas] },
    canActivate: [AuthGuard],
    // data: { animation: 'auth' }
  },
  {
    path: "listRefi",
    component: RefilComponent,
    data: { roles: [Role.SuperMonedas] },
    canActivate: [AuthGuard],
    // data: { animation: 'auth' }
  },
  {
    path: "listNuevosProd",
    component: NuevosProdComponent,
    data: { roles: [Role.SuperMonedas] },
    canActivate: [AuthGuard],
    // data: { animation: 'auth' }
  },
  {
    path: "listGenerar",
    component: GenerarComponent,
    data: { roles: [Role.SuperMonedas] },
    canActivate: [AuthGuard],
    // data: { animation: 'auth' }
  },
];

@NgModule({
  declarations: [
    CrosselingComponent,
    RefilComponent,
    NuevosProdComponent,
    GenerarComponent,
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
  ],
  exports: [
    CrosselingComponent,
    RefilComponent,
    NuevosProdComponent,
    GenerarComponent,
  ],
})
export class MdoModule {}
