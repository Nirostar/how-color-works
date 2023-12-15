import {AppComponent} from "./app.component";
import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {
  LmsConeResponseFunctionComponent
} from "./components/lms-cone-response-function/lms-cone-response-function.component";
import {LmsConeResponseFunctionService} from "./services/data-retrieval/lms-cone-response-function.service";
import {NgxSliderModule} from "ngx-slider-v2";
import {HttpClient, HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    LmsConeResponseFunctionComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgxSliderModule,
  ],
  providers: [
    LmsConeResponseFunctionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
