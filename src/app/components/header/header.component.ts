import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from './../../models/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent  {
  isExpanded = false;
  currentAccount: User | null = null;
  accounts: Map<string, User> | null = null;

  constructor(
    private authService: AuthService
  ) {
    this.authService.currentAccountValue.subscribe(account => {
      this.currentAccount = account;
    });
    this.authService.currentAllAccountsValue.subscribe(accounts => {
      this.accounts = accounts;
    });
  }

  toggleExpandAccounts(): void {
    this.isExpanded = !this.isExpanded;
  }

  switchToAccount(username: string): void {
    this.authService.switchAccount(username);
    this.toggleExpandAccounts();
  }

  logoutCurrentAccount(): void {
    this.authService.logout();
    this.toggleExpandAccounts();
  }

}
