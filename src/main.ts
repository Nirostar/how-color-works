import {platformBrowser} from '@angular/platform-browser';
import {AppModule} from "./app/app.module";

platformBrowser().bootstrapModule(AppModule).catch(e => console.error(e));
