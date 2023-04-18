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
import { ChartsModule } from 'ng2-charts';
import { FlatpickrModule } from 'angularx-flatpickr';

import { ActualizarStockComponent } from './productos/actualizar-stock/actualizar-stock.component';
import { AbastecimientoComponent } from './reportes/abastecimiento/abastecimiento.component';
import { StockComponent } from './reportes/stock/stock.component';
import { CaducidadComponent } from './reportes/caducidad/caducidad.component';
import { RotacionComponent } from './reportes/rotacion/rotacion.component';
import { RefilComponent } from './reportes/refil/refil.component';
import { ProductosEditarComponent } from './productos/listado/productos-editar/productos-editar.component';
import { ProductosListarComponent } from './productos/listado/productos-listar/productos-listar.component';
import { BuscarProductoComponent } from './productos/buscar-producto/buscar-producto.component';
import { SubcategoriasProductosComponent } from './productos/subcategorias-productos/subcategorias-productos.component';
import { CategoriasProductosComponent } from './productos/categorias-productos/categorias-productos.component';
import { NgxDropzoneModule } from 'ngx-dropzone';

const routes = [
  { 
    path: "", redirectTo: "categorias", pathMatch: "full" 
  },
  {
    path: "categorias",
    component: CategoriasProductosComponent,
    data: { roles: [Role.SuperMonedas] },
    canActivate: [AuthGuard],
    // data: { animation: 'auth' }
  },
  {
    path: "sub-categorias",
    component: SubcategoriasProductosComponent,
    data: { roles: [Role.SuperMonedas] },
    canActivate: [AuthGuard],
    // data: { animation: 'auth' }
  },
  {
    path: "productos",
    component: ProductosListarComponent,
    data: { roles: [Role.SuperMonedas] },
    canActivate: [AuthGuard],
    // data: { animation: 'auth' }
  },
  {
    path: "buscar-productos",
    component: BuscarProductoComponent,
    data: { roles: [Role.SuperMonedas] },
    canActivate: [AuthGuard],
    // data: { animation: 'auth' }
  },
  {
    path: "actualizar-stock",
    component: ActualizarStockComponent,
    data: { roles: [Role.SuperMonedas] },
    canActivate: [AuthGuard],
    // data: { animation: 'auth' }
  },
  {
    path: "reporte-abastecimiento",
    component: AbastecimientoComponent,
    data: { roles: [Role.SuperMonedas] },
    canActivate: [AuthGuard],
    // data: { animation: 'auth' }
  },
  {
    path: "reporte-stock",
    component: StockComponent,
    data: { roles: [Role.SuperMonedas] },
    canActivate: [AuthGuard],
    // data: { animation: 'auth' }
  },
  {
    path: "reporte-caducidad-productos",
    component: CaducidadComponent,
    data: { roles: [Role.SuperMonedas] },
    canActivate: [AuthGuard],
    // data: { animation: 'auth' }
  },
  {
    path: "reporte-rotacion-productos",
    component: RotacionComponent,
    data: { roles: [Role.SuperMonedas] },
    canActivate: [AuthGuard],
    // data: { animation: 'auth' }
  },
  {
    path: "reporte-refil",
    component: RefilComponent,
    data: { roles: [Role.SuperMonedas] },
    canActivate: [AuthGuard],
    // data: { animation: 'auth' }
  },
];

@NgModule({
  declarations: [
    CategoriasProductosComponent,
    SubcategoriasProductosComponent,
    ProductosListarComponent,
    ProductosEditarComponent,
    BuscarProductoComponent,
    ActualizarStockComponent,
    AbastecimientoComponent,
    StockComponent,
    CaducidadComponent,
    RotacionComponent,
    RefilComponent,

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
    NgxDropzoneModule,
  ],
  exports: [
    CategoriasProductosComponent,
    SubcategoriasProductosComponent,
    ProductosListarComponent,
    ProductosEditarComponent,
    BuscarProductoComponent,
    ActualizarStockComponent,
    AbastecimientoComponent,
    StockComponent,
    CaducidadComponent,
    RotacionComponent,
    RefilComponent,
  ]
})
export class MdpModule { }
