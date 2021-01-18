import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivate, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanLoad, CanActivate {
  isLoggedIn: boolean = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.authService.isLoggedIn.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });
  }

  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean  {
    if (this.isLoggedIn) {
      return true;
    }
    return false;
  }
  canLoad( route: Route, segments: UrlSegment[]): boolean | UrlTree  {
    if (this.isLoggedIn) {
      return true;
    }

    this.toastr.error('You must login first!', 'Not allowed', {
      positionClass: 'toast-bottom-left'
    });

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
