# Tips

1. Every observable has its own execution context

2. When you subscribe to an observable it will execute the code isolated from the rest of the application. This is the reason why you can have multiple subscriptions to the same observable and each subscription will have its own execution context.

3. Hot observables are observables that share the same execution context between multiple subscribers. This means that when you subscribe to a hot observable you will share the same execution context with other subscribers.

4. Cold observables are observables that do not share the same execution context between multiple subscribers. This means that when you subscribe to a cold observable you will have your own execution context.

## Subject

1. A subject is an Observable and Observer at the same time. It is an observable because it can emit values. It is an observer because it can subscribe to other observables.

2. A subject is a special type of observable that allows values to be multicasted to many observers. While plain observables are unicast (each subscribed observer owns an independent execution of the observable), subjects are multicast.

3. A subject is like an observable, but can multicast to many observers. Subjects are like EventEmitters: they maintain a registry of many listeners.

4. When a subject complete or errors out, it will also complete or error out the subscribers.

5. If a observer subscribes to a completed subject, the observer will receive the complete notification immediately.

## BehaviorSubject

1. A BehaviorSubject is a type of subject that requires an initial value and emits its current value (last emitted item) to new subscribers.
2. BehaviorSubjects are useful for representing "values over time". For instance, an event stream of birthdays is a Subject, but the stream of a person's age would be a BehaviorSubject.
3. When a observer subscribe to a BehaviorSubject, it will immediately receive the last emitted value by the subject. A regular observable only emits items that are emitted after a subscription.
4. When a observer subscribe to a completed BehaviorSubject, the observer will be completed immediatily without receive the last value.

## ReplaySubject

1. A ReplaySubject is a type of subject that will replay all of its items to a subscriber, regardless of when the subscriber subscribes.
2. A ReplaySubject require a buffer size as parameter. This buffer size will determine how many items will be replayed to the subscriber.
3. A ReplaySubject accept a second parameter, the window time. This parameter will determine how long the items will be stored in the buffer.
4. When a observer subscribe to a completed ReplaySubject, the observer will receive the last emitted values (depending on bufferSize and windowSize) immediatily and will be completed.

## ConnectableObservable. Multicast

1. A ConnectableObservable is a type of observable that will not emit items until its connect() method is called.
2. Multicast is a type of observable that will not emit items until its connect() method is called.
3. It is deprecated in favour of using `connectable` operator.
4. Deprecated `refCount` operator to automatically connect when has 1 suscriber and disconnect when the number of subscribers is 0.
5. Use `share` operator instead of `multicast + refCount`.
6. Publish operator is the same as multicast(new Subject()).
7. Publish and Multicast are deprecated, use share, connectable and connect instead.

```javascript
// publish = multicast + Subject
// publishReplay = multicast + ReplaySubject
// publishBehavior = multicast + BehaviorSubject
// publishLast = multicast + AsyncSubject

// share = publish().refCount()
// publish = multicast + Subject
// publishReplay = multicast + ReplaySubject
// publishBehavior = multicast + BehaviorSubject
// publishLast = multicast + AsyncSubject
```

## Share

1. Share is a type of observable that will automatically connect when has 1 suscriber and disconnect when the number of subscribers is 0.
2. Share is the same as publish().refCount().
3. Share is the same as multicast(new Subject()).refCount().
4. Share can reset subscribers when the source observable completes or errors out. resetOnComplete and resetOnError parameters.
5. Share can reser subscriber when subscription count is 0. resetOnRefCountZero parameter.

## Selectors
