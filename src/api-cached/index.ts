import { Observable, share, Subject, take, of, tap, ReplaySubject, mergeMap } from 'rxjs';

// ~~~~~ Fake api call

let count = 0;

function apiCall$() {
  console.log('API Call');

  const obs$ = new Observable<{ value: string; tls: number }>(observer => {
    setTimeout(() => {
      count += 1;

      const res = {
        value: `data-${count}`,
        tls: Date.now() + 4000
      };

      console.log('res', res);

      observer.next(res);
      observer.complete();
    }, 1000);
  });

  return obs$;
}

// ~~~~~~ Wrap api call with cache

const cacheApiCall = <T>(initialValue: T, apiCall$: () => Observable<T>, isCacheValid: (cachedValue: T) => boolean) => {
  // Cached subject

  const cachedData$$ = new ReplaySubject<T>(1);

  // First value

  cachedData$$.next(initialValue);

  // Cached api call

  const cachedApiCall$ = cachedData$$.pipe(
    mergeMap(cachedData => {
      if (isCacheValid(cachedData)) {
        return of(cachedData);
      }

      return apiCall$().pipe(
        tap(data => {
          cachedData$$.next(data);
        })
      );
    })
  );

  // Share call to cached api call

  return cachedApiCall$.pipe(take(1), share());
};

// ~~~~~~ Test

const GracePeriod = 1000;

// type CachedData = typeof apiCall$ extends () => Observable<infer T> ? T : never;

type CachedData = ReturnType<typeof apiCall$> extends Observable<infer T> ? T : never;

const cachedDataPredicate = (cachedData: CachedData) => cachedData && Date.now() + GracePeriod < cachedData.tls;

const sharedCachedApiCall$ = cacheApiCall({ value: '', tls: 0 }, apiCall$, cachedDataPredicate);

const sub$$ = new Subject();

sharedCachedApiCall$.subscribe({
  next: d => sub$$.next(`foo ${d.value} ${d.tls}`)
});

sharedCachedApiCall$.subscribe({
  next: d => sub$$.next(`bar ${d.value} ${d.tls}`)
});

setTimeout(() => {
  sharedCachedApiCall$.subscribe({
    next: d => sub$$.next(`baz ${d.value} ${d.tls}`)
  });

  setTimeout(() => {
    sharedCachedApiCall$.subscribe({
      next: d => sub$$.next(`qux ${d.value} ${d.tls}`)
    });
  }, 1000);

  setTimeout(() => {
    sharedCachedApiCall$.subscribe({
      next: d => sub$$.next(`quux ${d.value} ${d.tls}`)
    });
  }, 2000);

  setTimeout(() => {
    sharedCachedApiCall$.subscribe({
      next: d => sub$$.next(`quux ${d.value} ${d.tls}`)
    });
  }, 6000);
}, 4000);

sub$$.subscribe({
  next: d => console.log('sub$$', d)
});
