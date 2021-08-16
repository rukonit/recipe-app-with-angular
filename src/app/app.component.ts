import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AuthService } from './auth/auth.service';
import * as fromApp from './store/app.reducer';
import * as fromAuthActions from './auth/store/auth.actions';
import { Store } from '@ngrx/store';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'recipe';

  constructor(private authService: AuthService,
    private store: Store<fromApp.AppState>,
    @Inject(PLATFORM_ID) private platformId: Object
    ) {
      
    }
ngOnInit() {
  
  if(isPlatformBrowser(this.platformId)) {

    this.store.dispatch(new fromAuthActions.AutoLogin());
  }
}

}
