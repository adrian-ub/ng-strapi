import { NgModule, ModuleWithProviders } from '@angular/core';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { HttpService } from './services/http.service';
import { StoreConfig } from './models/storeConfig';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  providers: [
  ],
  imports: [
    HttpClientModule
  ]
})
export class NgStrapiModule {
  public static forRoot(baseUrl: string, storeConfig?: StoreConfig): ModuleWithProviders {
    return {
      ngModule: NgStrapiModule,
      providers: [
        HttpService,
        { provide: 'config', useValue: storeConfig },
        { provide: 'baseUrl', useValue: baseUrl },
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true }
      ]
    };
  }
}
