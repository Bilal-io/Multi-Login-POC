import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  accounts: Map<string, User> | null = null;
  showLogin: boolean = true;

  constructor(
    private authService: AuthService
  ) {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('1234', Validators.required),
    });

    this.authService.currentAllAccountsValue.subscribe(accounts => {
      this.accounts = accounts;
      this.showLogin = this.accounts.size === 0;
    });
  }

  ngOnInit(): void {
  }

  onLogin() {
    this.authService.login(this.loginForm.controls.username.value, this.loginForm.controls.password.value)
    .pipe(first())
    .subscribe(
      e => {
        console.log(e);
      },
      error => {
        console.error(error);
      }
    );
  }

  onSwitch(username: string) {
    this.authService.switchAccount(username);
  }

}
