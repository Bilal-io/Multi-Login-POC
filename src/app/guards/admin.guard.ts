import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivate, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanLoad, CanActivate {
  isAdmin: boolean = false;
  isLoggedIn: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.authService.isLoggedIn.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });

    this.authService.isAdmin.subscribe(admin => {
      this.isAdmin = admin;
    });
  }

  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean  {
    if (this.isLoggedIn && this.isAdmin) {
      return true;
    }
    return false;
  }
  canLoad( route: Route, segments: UrlSegment[]): boolean | UrlTree  {
    // all good if authenticated and is an admin
    if (this.isLoggedIn && this.isAdmin) {
      return true;
    }

    // if authenticated but not an admin, redirect to /dashboard
    if (this.isLoggedIn && !this.isAdmin) {
      // display a notification
      this.toastr.error('You\'re not an admin buddy!', 'Not allowed', {
        positionClass: 'toast-bottom-left'
      });
      // return a rout
      return this.router.createUrlTree(['/dashboard']);
    }

    // If the user is attempting to visit page, we redirect to login, but preserve the url in query param, to redirect them back after a successful login
    if (window.location.pathname !== '/') {
      return this.router.createUrlTree(['/login'], {
        queryParams: {
          redirect:  encodeURIComponent(window.location.pathname)
        }
      });
    }

    // if none of the above conditions are met, we redirect to login
    return this.router.createUrlTree(['/login']);

  }


}
