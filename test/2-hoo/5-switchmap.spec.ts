import { ajax } from 'rxjs/ajax';

import { interval, take, switchMap, map } from 'rxjs';

describe('switchMap operator', () => {
  // ~~~~~~ SwitchMap with ajax

  it('should repeat a request 3 times every 1 second using ajax', done => {
    const req = () =>
      ajax<{ login: string; avatar_url: string }[]>({
        url: 'https://api.github.com/users',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).pipe(map(res => res.response[0]));

    const obs$ = interval(1000).pipe(take(3));

    const result$ = obs$.pipe(switchMap(() => req()));

    result$.subscribe({
      next: value => {
        console.log(value.login);
      },

      error: error => console.log('Error', error),

      complete: () => {
        console.log('complete');

        done();
      }
    });
  });

  // ~~~~~~ SwitchMap with fetch

  it('should repeat a request 3 times every 1 second using ajax', done => {
    const req = () =>
      fetch('https://api.github.com/users')
        .then(res => res.json() as Promise<{ login: string; avatar_url: string }[]>)
        .then(res => res[0]);

    const obs$ = interval(1000).pipe(take(3));

    const result$ = obs$.pipe(switchMap(() => req()));

    result$.subscribe({
      next: value => {
        console.log(value.login);
      },

      error: error => console.log('Error', error),

      complete: () => {
        console.log('complete');

        done();
      }
    });
  });
});
