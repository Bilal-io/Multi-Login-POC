import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentAccountSubject = new BehaviorSubject<User | null>(null);
  private accountsSubject = new BehaviorSubject<Map<string, User>>(new Map());
  private loggedIn = new BehaviorSubject<boolean>(false);
  private admin = new BehaviorSubject<boolean>(false);

  get currentAllAccountsValue() {
    return this.accountsSubject?.asObservable();
  }

  get currentAccountValue() {
    return this.currentAccountSubject?.asObservable();
  }

  get isLoggedIn() {
    return this.loggedIn?.asObservable();
  }

  get isAdmin() {
    return this.admin?.asObservable();
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Call getAccountsFromLocalStorage and store the returned value in accountsSubject
    this.accountsSubject.next(this.getAccountsFromLocalStorage());

    // If We have accounts stored in localStorage, we can check if there is anything in sessionStorage
    // Stores a null in currentAccountSubject if sessionStorage doesn't have an account
    if (this.accountsSubject.value.size > 0) {
      this.currentAccountSubject.next(this.getCurrentAccountFromSessionStorage());
      //... you call a function to validate the current account's JWT.
      // Perhaps a good idea to do it every time an account switch happens.
      if (this.currentAccountSubject.value) {
        this.loggedIn.next(true);
        this.admin.next(!!this.currentAccountSubject.value?.isAdmin);
      }
    }
  }

  login(username: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, { username, password })
      .pipe(map((account: User) => {
        // Store account details and jwt token in localStorage
        localStorage.setItem(`account-${account.username}`, JSON.stringify(account));
        // Store a reference of the current account in sessionStorage
        sessionStorage.setItem('currentAccount', account.username);

        // update all BehaviorSubjects
        this.accountsSubject.value.set(`account-${account.username}`, account);
        this.currentAccountSubject.next(account);
        this.loggedIn.next(true);
        this.admin.next(!!this.currentAccountSubject.value?.isAdmin);

        this.redirectAfterLogin();

        return account;
      }));
  }

  switchAccount(username: string) {
    const currentAccount = this.accountsSubject.value.get(`account-${username}`) || null;
    this.currentAccountSubject.next(currentAccount);
    // Perhaps a good idea to validate the current account's JWT every time an account switch happens.
    this.loggedIn.next(true);
    this.admin.next(!!this.currentAccountSubject.value?.isAdmin);

    sessionStorage.setItem('currentAccount', username);

    this.redirectAfterLogin();
  }

  logout(): void {
    // Remove account from localStorage and sessionStorage
    localStorage.removeItem(`account-${this.currentAccountSubject?.value?.username}` || '');
    sessionStorage.removeItem('currentAccount');

    // Remove account from accounts and nullify currentAccountSubject and currentAccount
    this.accountsSubject.value.delete(`account-${this.currentAccountSubject?.value?.username}`);
    this.currentAccountSubject.next(null);
    this.loggedIn.next(false);
    this.admin.next(false);

    // Navigate to login
    this.router.navigate(['/login']);
  }

  private getAccountsFromLocalStorage(): Map<string, User> {
    const accounts: Map<string, User> = new Map();
    const localStorageLength = localStorage.length;

    for (let i = 0; i < localStorageLength; i++) {
      const item = localStorage.key(i);
      if (item?.includes('account-', 0)) {
        accounts.set(item, JSON.parse(localStorage.getItem(item) || '{}'));
      }
    }
    return accounts;
  }

  private getCurrentAccountFromSessionStorage(): User | null {
    const currentAccountUsername = sessionStorage.getItem('currentAccount');
    return this.accountsSubject.value.get(`account-${currentAccountUsername}`) || null;
  }

  private redirectAfterLogin() {
    // get return url from route parameters or default to '/dashboard'
    const returnUrl = this.route.snapshot.queryParams['redirect'] ? decodeURIComponent(this.route.snapshot.queryParams['redirect']) : '/dashboard';
    this.router.navigate([returnUrl]);
  }
}
