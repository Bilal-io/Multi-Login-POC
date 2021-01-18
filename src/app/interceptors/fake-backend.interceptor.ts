// Snippet copied and modified from https://github.com/cornflourblue/angular-10-jwt-authentication-example
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { User } from '../models/user';

const users: User[] = [
  {
    id: 'c365bef3-a079-4e27-b05f-40ef36e1fa18',
    username: 'test1',
    password: '1234',
    firstName: 'John',
    lastName: 'Doe'
  },
  {
    id: 'e473b078-d8f0-4ea0-b324-02c6e38b939b',
    username: 'test2',
    password: '1234',
    firstName: 'Jane',
    lastName: 'Doe',
    isAdmin: true
  },
  {
    id: '4c9790c1-67c7-44cc-9b6e-20aa6cea8168',
    username: 'test3',
    password: '1234',
    firstName: 'Joanna',
    lastName: 'Doe',
    isAdmin: true
  },
  {
    id: '2b4b6a80-34f3-4b08-bb98-8d06865c6d7d',
    username: 'test4',
    password: '1234',
    firstName: 'Jin',
    lastName: 'Doe'
  },
];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;

    // wrap in delayed observable to simulate server api call
    return of(null)
      .pipe(mergeMap(handleRoute))
      .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
      .pipe(delay(500))
      .pipe(dematerialize());

    function handleRoute() {
      if (url.endsWith('/users/authenticate') && method === 'POST') {
        return authenticate();
      } else {
        // pass through any requests not handled above
        return next.handle(request);
      }
    }

    // route functions

    function authenticate() {
      const { username, password } = body;
      const user = users.find(
        (x) => x.username === username && x.password === password
      );
      if (!user) return error('Username or password is incorrect');
      return ok({
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        token: 'fake-jwt-token',
        isAdmin: user.isAdmin
      });
    }

    // helper functions

    function ok(body?: User) {
      return of(new HttpResponse({ status: 200, body }));
    }

    function error(message: string) {
      return throwError({ error: { message } });
    }
  }
}

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true,
};
