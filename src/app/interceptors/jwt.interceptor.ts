// Snippet copied from https://github.com/cornflourblue/angular-10-jwt-authentication-example
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthService } from './../services/auth.service';
import { User } from '../models/user';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  currentUser: User | null = null;
  isLoggedIn: boolean = false;
  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      // add auth header with jwt if user is logged in and request is to the api url
      this.authService.currentAccountValue.subscribe(account => {
        this.currentUser = account;
      });
      this.authService.isLoggedIn.subscribe(loggedIn => {
        this.isLoggedIn = loggedIn;
      });

      const isApiUrl = request.url.startsWith(environment.apiUrl);
      if (this.isLoggedIn && isApiUrl) {
          request = request.clone({
              setHeaders: {
                  Authorization: `Bearer ${this.currentUser?.token}`
              }
          });
      }

      return next.handle(request);
  }
}
