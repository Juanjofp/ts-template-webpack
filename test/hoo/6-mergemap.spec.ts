import { ajax } from 'rxjs/ajax';
import { map, mergeMap, interval, take, of } from 'rxjs';

describe('mergeMap operator', () => {
  // ~~~~~~ MergeMap with ajax

  it('Should repeat a request 3 times every 1 second using ajax', done => {
    const expected = ['mojombo', 'mojombo', 'mojombo'];

    const result: string[] = [];
    // ~~~~~~ Requesr users from github

    const req = () =>
      ajax<{ login: string; avatar_url: string }[]>({
        url: 'https://api.github.com/users',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).pipe(map(res => res.response[0]));

    // ~~~~~~ Repeat the request 3 times

    const obs$ = interval(1000).pipe(take(3));

    // ~~~~~~ Same result as using concatMap, because the requests are not concurrent

    const result$ = obs$.pipe(mergeMap(() => req(), 1));

    result$.subscribe({
      next: value => {
        result.push(value.login);
      },

      complete: () => {
        expect(result).toEqual(expected);

        done();
      }
    });
  });

  it('Should multiply by 2 the values of observable', done => {
    const expected = [0, 2, 4, 6, 8, 10];

    const result: number[] = [];

    const obs$ = interval(100).pipe(take(6));

    const result$ = obs$.pipe(mergeMap(value => of(value * 2)));

    /*

    obs$:     ---0---1---2---3---4---5|

    mergeMap: ---0---1---2---3---4---5|
                  \   \   \   \   \   \
                  0|  2|  4|  6|  8| 10|

    result$:  ---0---2---4---6---8--10|
    */

    result$.subscribe({
      next: value => {
        result.push(value);
      },

      complete: () => {
        console.log(result, expected);

        expect(result).toEqual(expected);

        done();
      }
    });
  });
});
