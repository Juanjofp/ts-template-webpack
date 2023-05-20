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
