import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule, Routes} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';

import 'hammerjs';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';
import {ToastrModule} from 'ngx-toastr'; // For auth after login toast

import {CoreModule} from '@core/core.module';
import {CoreCommonModule} from '@core/common.module';
import {CoreSidebarModule, CoreThemeCustomizerModule} from '@core/components';

import {coreConfig} from 'app/app-config';

import {AppComponent} from 'app/app.component';
import {LayoutModule} from 'app/layout/layout.module';
import {SampleModule} from 'app/main/sample/sample.module';
import {AuthGuard} from './auth/helpers/auth.guards';
import {JwtInterceptor} from './auth/helpers/jwt.interceptor';
import {ErrorInterceptor} from './auth/helpers/error.interceptor';

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'ifis',
        pathMatch: 'full',
    },
    {
        path: 'pages',
        loadChildren: () =>
            import('./main/pages/pages.module').then((m) => m.PagesModule),
    },
    {
        path: 'grp',
        loadChildren: () =>
            import('./main/center/center.module').then((m) => m.CenterModule),
    },
    {
        path: 'ifis',
        loadChildren: () =>
            import('./main/ifis/ifis.module').then((m) => m.IfisModule),
    },
    {
        path: 'cargar-creditos',
        loadChildren: () =>
            import('./main/cargar-creditos/cargar-creditos.module').then(
                (m) => m.CargarCreditosModule
            ),
    },
    {
        path: 'operacion-creditos-preaprobados',
        loadChildren: () =>
            import(
                './main/op-creditos-preaprobados/op-creditos-preaprobados.module'
                ).then((m) => m.OpCreditosPreAprobadosModule),
    },
    {
        path: 'operacion-creditos-empleados',
        loadChildren: () =>
            import('./main/op-creditos-empleados/op-creditos-empleados.module').then(
                (m) => m.OpCreditosEmpleadosModule
            ),
    },
    {
        path: 'operacion-creditos-autonomos',
        loadChildren: () =>
            import('./main/op-creditos-autonomos/op-creditos-autonomos.module').then(
                (m) => m.OpCreditosAutonomosModule
            ),
    },
    {
        path: 'solicitudes-creditos',
        loadChildren: () =>
            import('./main/solicitudes-creditos/solicitudes-creditos.module').then(
                (m) => m.SolicitudesCreditosModule
            ),
    },
    {
        path: 'reporte-solicitudes-creditos',
        loadChildren: () =>
            import('./main/reporte-solicitudes-credito/reporte-solicitudes-credito.module').then(
                (m) => m.ReporteSolicitudesCreditoModule
            ),
    },
    {
        path: 'prospectos-clientes',
        loadChildren: () =>
            import('./main/mdm/mdm.module').then((m) => m.MdmModule),
    },
    ///
    {
        path: 'ClientesList',
        loadChildren: () =>
            import('./main/mdm/mdm.module').then((m) => m.MdmModule),
    },
    {
        path: 'TransaccionesCli',
        loadChildren: () =>
            import('./main/mdm/mdm.module').then((m) => m.MdmModule),
    },
    {
        path: 'GenerarTrans',
        loadChildren: () =>
            import('./main/mdm/mdm.module').then((m) => m.MdmModule),
    },
    {
        path: 'mdp',
        loadChildren: () =>
            import('./main/mdp/mdp.module').then((m) => m.MdpModule),
    },
    {
        path: 'crosseling',
        loadChildren: () =>
            import('./main/mdo/mdo.module').then((m) => m.MdoModule),
    },
    {
        path: 'negocios',
        loadChildren: () =>
            import('./main/mdm/mdm.module').then((m) => m.MdmModule),
    },
    {
        path: 'refil',
        loadChildren: () =>
            import('./main/mdo/mdo.module').then((m) => m.MdoModule),
    },
    {
        path: 'NuevosProd',
        loadChildren: () =>
            import('./main/mdo/mdo.module').then((m) => m.MdoModule),
    },
    {
        path: 'Generar',
        loadChildren: () =>
            import('./main/mdo/mdo.module').then((m) => m.MdoModule),
    },
    //
    {
        path: '**',
        redirectTo: '/pages/miscellaneous/error', //Error 404 - Page not found
    },
];

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes, {
            scrollPositionRestoration: 'enabled', // Add options right here
            relativeLinkResolution: 'legacy',
            useHash: true,
        }),
        TranslateModule.forRoot(),

        //NgBootstrap
        NgbModule,
        ToastrModule.forRoot(),

        // Core modules
        CoreModule.forRoot(coreConfig),
        CoreCommonModule,
        CoreSidebarModule,
        CoreThemeCustomizerModule,

        // App modules
        LayoutModule,
        SampleModule,
    ],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}
