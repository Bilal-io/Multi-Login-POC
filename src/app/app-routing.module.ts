import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from './guards/admin.guard';
import { AuthenticationGuard } from './guards/authentication.guard';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthenticationGuard], // this will prevent the route from being activated if the user is not authenticated
    canLoad: [AuthenticationGuard], // this module will not lazily load if the user is not authenticated
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canLoad: [AdminGuard], // this module will not lazily load if the user is not an admin
    canActivate: [AdminGuard] // this will prevent the route from being activated if the user is not an admin
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }

