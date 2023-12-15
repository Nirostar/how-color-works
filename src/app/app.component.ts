import {Component} from '@angular/core';
import {LmsConeResponseFunctionService} from "./services/data-retrieval/lms-cone-response-function.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'how-color-works';
  protanomalyFactor: number = 0;
  deuteranomalyFactor: number = 0;

  constructor(public lmsConeResponseFunctionService: LmsConeResponseFunctionService) {
  }
}
