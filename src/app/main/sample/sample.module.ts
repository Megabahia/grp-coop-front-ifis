import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { CoreCommonModule } from '@core/common.module';

import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

import { SampleComponent } from './sample.component';
import { HomeComponent } from './home.component';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { FormsModule } from '@angular/forms';
import { CoreTouchspinModule } from '../../../@core/components/core-touchspin/core-touchspin.module';
import { CoreSidebarModule } from '../../../@core/components/core-sidebar/core-sidebar.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const routes = [
  {
    path: 'sample',
    component: SampleComponent,
    data: { animation: 'auth' }
  },
  {
    path: 'home',
    component: HomeComponent,
    data: { animation: 'home' }
  }
];

@NgModule({
  declarations: [SampleComponent, HomeComponent],
  imports: [
    RouterModule.forChild(routes), 
    ContentHeaderModule, 
    TranslateModule, 
    CoreCommonModule, 
    SwiperModule,
    FormsModule,
    CoreTouchspinModule,
    ContentHeaderModule,
    CoreSidebarModule,
    NgbModule,
     ],
  exports: [SampleComponent, HomeComponent]
})
export class SampleModule { }
