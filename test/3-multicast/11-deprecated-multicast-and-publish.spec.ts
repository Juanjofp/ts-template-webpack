import {
  Subject,
  connectable,
  interval,
  take,
  share,
  connect,
  combineLatest,
  BehaviorSubject,
  AsyncSubject,
  ReplaySubject,
  tap
} from 'rxjs';

describe('Refactor ConnectableObservable', () => {
  it('Create connectable observable', done => {
    const obs$ = interval(500).pipe(take(6));

    // deprecated
    // const tick$ = new ConnectableObservable(obs$, () => new Subject());
    // tick$.connect();

    // suggested refactor
    // Instead of creating a ConnectableObservable instance,
    // call the connectable function to obtain a connectable observable

    const tick$ = connectable(obs$, {
      connector: () => new Subject()
    });

    tick$.connect();

    tick$.subscribe(value => console.log('obs1', value));

    setTimeout(() => {
      tick$.subscribe(value => console.log('obs2', value));
    }, 2000);

    setTimeout(done, 4000);
  });

  it('Create connectable observable with refCount', done => {
    const obs$ = interval(500);

    // deprecated
    // const tick$ = new ConnectableObservable(obs$, () => new Subject()).refCount();

    // suggested refactor
    // In situations in which the refCount method is used, the share operator can be used instead

    const tick$ = obs$.pipe(share({ connector: () => new Subject() }));

    const sub1 = tick$.subscribe(value => console.log('obs1', value));

    setTimeout(() => {
      const sub2 = tick$.subscribe(value => console.log('obs2', value));

      setTimeout(() => {
        sub2.unsubscribe();

        done();
      }, 2000);
    }, 2000);

    setTimeout(() => {
      sub1.unsubscribe();
    }, 3000);
  });
});

describe('Refactor multicast', () => {
  it('Create multicast observable with a factory', done => {
    const obs$ = interval(500).pipe(take(6));

    // deprecated
    // const tick$ = obs$.pipe(multicast(() => new Subject())) as ConnectableObservable<number>;

    // suggested refactor
    // Where multicast is called with a subject factory, can be replaced with connectable

    const tick$ = connectable(obs$, {
      connector: () => new Subject()
    });

    tick$.subscribe(value => console.log('obs1', value));

    setTimeout(() => {
      tick$.subscribe(value => console.log('obs2', value));
    }, 2000);

    tick$.connect();

    setTimeout(done, 4000);
  });

  it('Create multicast observable with a single subject instance', done => {
    const obs$ = interval(500).pipe(take(6));

    // deprecated
    // const tick$ = obs$.pipe(multicast(new Subject())) as ConnectableObservable<number>;

    // suggested refactor
    // Where multicast is called with a subject instance,
    // it can be replaced with connectable and a local subject instance.

    const tick$ = connectable(obs$, {
      connector: () => new Subject(),
      resetOnDisconnect: false // Keep the subject instance, don't create a new one
    });

    tick$.subscribe(value => console.log('obs1', value));

    setTimeout(() => {
      tick$.subscribe(value => console.log('obs2', value));
    }, 2000);

    tick$.connect();

    setTimeout(done, 4000);
  });

  it('Create multicast observable with refCount', done => {
    const obs$ = interval(500);

    // deprecated
    // const tick$ = obs$.pipe(
    //   multicast(() => new Subject()),
    //   refCount()
    // );

    // suggested refactor
    // Where multicast is used in conjunction with refCount,
    // it can be replaced with share

    const tick$ = obs$.pipe(share({ connector: () => new Subject() }));

    const sub1 = tick$.subscribe(value => console.log('obs1', value));

    setTimeout(() => {
      const sub2 = tick$.subscribe(value => console.log('obs2', value));

      setTimeout(() => {
        sub2.unsubscribe();

        done();
      }, 2000);
    }, 2000);

    setTimeout(() => {
      sub1.unsubscribe();
    }, 3000);
  });

  it('Create multicast observable with selector', done => {
    const obs$ = interval(500).pipe(take(6));

    // deprecated

    // const tick$ = obs$.pipe(
    //   multicast(
    //     () => new Subject(),
    //     source => combineLatest([source, source])
    //   )
    // );

    // suggested refactor
    // Where multicast is used with a selector,
    // it can be replaced with connect

    const tick$ = obs$.pipe(
      connect(source => combineLatest([source, source]), {
        connector: () => new Subject()
      })
    );

    tick$.subscribe(value => console.log('obs1', value));

    setTimeout(done, 4000);
  });
});

describe('Refactor publish', () => {
  it('Create publish observable with a factory', done => {
    const obs$ = interval(500).pipe(take(6));

    // deprecated
    // const tick$ = obs$.pipe(publish()) as ConnectableObservable<number>;

    // suggested refactor
    // If you're using publish to create a ConnectableObservable, you can use connectable instead.

    const tick$ = connectable(obs$, {
      connector: () => new Subject<number>(),
      resetOnDisconnect: false // Publish is a multicast with a single subject instance
    });

    tick$.subscribe(value => console.log('obs1', value));

    setTimeout(() => {
      tick$.subscribe(value => console.log('obs2', value));
    }, 2000);

    tick$.connect();

    setTimeout(done, 4000);
  });

  it('Create a publish observable with a refCount', done => {
    const obs$ = interval(500);

    // deprecated
    // const tick$ = obs$.pipe(publish(), refCount());

    // suggested refactor
    // And if refCount is being applied to the result of publish,
    // you can use share to replace both

    const tick$ = obs$.pipe(
      share({
        resetOnError: false, // Publish is a multicast with a single subject instance
        resetOnComplete: false, // Publish is a multicast with a single subject instance
        resetOnRefCountZero: false // Publish is a multicast with a single subject instance
      })
    );

    const sub1 = tick$.subscribe(value => console.log('obs1', value));

    setTimeout(() => {
      const sub2 = tick$.subscribe(value => console.log('obs2', value));

      setTimeout(() => {
        sub2.unsubscribe();

        done();
      }, 2000);
    }, 2000);

    setTimeout(() => {
      sub1.unsubscribe();
    }, 3000);
  });

  it('Create publish observable with selector', done => {
    const obs$ = interval(500);

    // deprecated

    // deprecated
    // const tick$ = obs$.pipe(publish(source => combineLatest([source, source])));

    // suggested refactor
    // If publish is being called with a selector,
    // you can use the connect operator instead

    const tick$ = obs$.pipe(connect(source => combineLatest([source, source])));

    const sub = tick$.subscribe(value => console.log('obs1', value));

    setTimeout(() => {
      sub.unsubscribe();
    }, 4000);

    setTimeout(done, 4100);
  });
});

describe('Refactor publishBehavior', () => {
  it('Create a publishBehavior observable', done => {
    const obs$ = interval(500).pipe(take(2));

    // deprecated
    // const tick$ = obs$.pipe(publishBehavior(99)) as ConnectableObservable<number>;

    // suggested refactor
    // If you're using publishBehavior to create a ConnectableObservable,
    // you can use connectable and a BehaviorSubject instead

    const tick$ = connectable(obs$, {
      connector: () => new BehaviorSubject(99),
      resetOnDisconnect: false
    });

    tick$.subscribe(value => console.log('obs1', value));

    setTimeout(() => {
      tick$.subscribe({
        next: value => console.log('obs2', value),

        complete: () => console.log('obs2 complete')
      });
    }, 2000);

    tick$.connect();

    setTimeout(done, 4000);
  });

  it('Create a publishBehavior observable with refCount', done => {
    const obs$ = interval(500).pipe(take(8));

    // deprecated
    // const tick$ = obs$.pipe(publishBehavior(99), refCount());

    // suggested refactor
    // And if refCount is being applied to the result of publishBehavior,
    // you can use the share operator - with a BehaviorSubject connector - to replace both

    const tick$ = obs$.pipe(
      share({
        connector: () => new BehaviorSubject(0),
        resetOnError: false,
        resetOnComplete: false,
        resetOnRefCountZero: false
      })
    );

    const sub1 = tick$.subscribe(value => console.log('obs1', value));

    setTimeout(() => {
      const sub2 = tick$.subscribe(value => console.log('obs2', value));

      setTimeout(() => {
        sub2.unsubscribe();

        done();
      }, 2000);
    }, 2000);

    setTimeout(() => {
      sub1.unsubscribe();
    }, 3000);
  });
});

describe('Refactor publishLast', () => {
  it('Create a publishLast observable', done => {
    const obs$ = interval(500).pipe(take(3));

    // deprecated
    // const tick$ = obs$.pipe(publishLast()) as ConnectableObservable<number>;

    // suggested refactor
    // If you're using publishLast to create a ConnectableObservable,
    // you can use connectable and an AsyncSubject instead

    const tick$ = connectable(obs$, {
      connector: () => new AsyncSubject<number>(),
      resetOnDisconnect: false
    });

    tick$.subscribe(value => console.log('obs1', value));

    setTimeout(() => {
      tick$.subscribe({
        next: value => console.log('obs2', value),

        complete: () => console.log('obs2 complete')
      });
    }, 2000);

    tick$.connect();

    setTimeout(done, 4000);
  });

  it('Create a publishLast observable with refCount', done => {
    const obs$ = interval(100).pipe(take(3));

    // deprecated
    // const tick$ = obs$.pipe(publishLast(), refCount());

    // suggested refactor
    // And if refCount is being applied to the result of publishLast,
    // you can use the share operator - with an AsyncSubject connector - to replace both.

    const tick$ = obs$.pipe(
      share({
        connector: () => new AsyncSubject(),
        resetOnError: false,
        resetOnComplete: false,
        resetOnRefCountZero: false
      })
    );

    tick$.subscribe(value => console.log('obs1', value));

    setTimeout(() => {
      tick$.subscribe(value => console.log('obs2', value));

      setTimeout(done);
    }, 2000);
  });
});

describe('Refactor publishReplay', () => {
  jest.setTimeout(10000);

  it('Create a publishReplay observable', done => {
    const obs$ = interval(500).pipe(take(6));

    // deprecated
    // const tick$ = obs$.pipe(publishReplay(3)) as ConnectableObservable<number>;

    // suggested refactor
    // If you're using publishReplay to create a ConnectableObservable,
    // you can use connectable and a ReplaySubject instead

    const tick$ = connectable(obs$, {
      connector: () => new ReplaySubject<number>(3),
      resetOnDisconnect: false
    });

    tick$.subscribe(value => console.log('obs1', value));

    setTimeout(() => {
      tick$.subscribe({
        next: value => console.log('obs2', value),

        complete: () => console.log('obs2 complete')
      });
    }, 3500);

    tick$.connect();

    setTimeout(done, 4000);
  });

  it('Create a publishReplay observable with refCount', done => {
    const obs$ = interval(500).pipe(tap(value => console.log('source', value)));

    // deprecated
    // const tick$ = obs$.pipe(publishReplay(3), refCount());

    // suggested refactor
    const tick$ = obs$.pipe(
      share({
        connector: () => new ReplaySubject(3),
        resetOnError: false,
        resetOnComplete: false,
        resetOnRefCountZero: true
      })
    );

    const sub1 = tick$.subscribe(value => console.log('obs1', value));

    setTimeout(() => {
      const sub2 = tick$.subscribe(value => console.log('obs2', value));

      setTimeout(() => {
        console.log('unsubscribing sub2');

        sub2.unsubscribe();

        setTimeout(done, 3000);
      }, 1500);
    }, 2000);

    setTimeout(() => {
      console.log('unsubscribing sub1');

      sub1.unsubscribe();
    }, 1500);
  });

  it('Create a publishReplay observable with selector', done => {
    const obs$ = interval(500).pipe(tap(value => console.log('source', value)));

    // deprecated
    // const tick$ = obs$.pipe(publishReplay(3, undefined, source => combineLatest([source, source])));

    // suggested refactor
    const tick$ = obs$.pipe(
      connect(source => combineLatest([source, source]), {
        connector: () => new ReplaySubject(1)
      })
    );

    const sub = tick$.subscribe(value => console.log('obs1', value));

    setTimeout(() => {
      sub.unsubscribe();
    }, 4000);

    setTimeout(done, 4100);
  });
});
