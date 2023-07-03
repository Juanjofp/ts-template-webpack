# Tips for observables

1. Try to avoid subject when possible. Use `new Observable()` instead.

2. Better than `new Obserbale()` try to use some operator like `from()`, `of()`, `interval()`, `fromEvent()`.

3. Use `takeUntil()` to unsubscribe from an observable automatically.

4. Use `share()` to share the same observable between multiple subscribers.

5. Use `shareReplay()` to share the same observable between multiple subscribers and replay the last emitted value.

6. Use `switchMap()` to cancel previous observable when a new one is emitted.

7. Use `mergeMap()` to merge multiple observables.

8. Use `map()` to transform the emitted value. Avoid using nested `subscribe()`.

9. Use Higher Order Observables (HO) to combine multiple observables. Avoid using nested `subscribe()`.

10. Use `catchError()` to handle errors.

11. Replace `zip()` with `combineLatest()` when possible. `zip()` will wait for all observables to emit a value before emitting the first one (Promise.all). `combineLatest()` will emit a value as soon as one of the observables emits a value. `withLatestFrom()` is similar to `combineLatest()` but it will only emit a value when the source observable emits a value.

12. Move importan side effect to the `subscribe()` method. Do not use `tap()` to do side effects. Try to split observables in a way that you can do side effects in the `subscribe()` method. This will make your code more readable and easier to test.Example: `click$ -> fetch$ -> subscribe() -> render` and `click$ -> subscribe() -> store in db` and `click$ -> fetch -> subscribe -> updateCache `.

13. Implement pause and resume in the right way. Use `switchMap()` to cancel previous observable when a new one is emitted. Use `takeUntil()` to unsubscribe from an observable automatically. Use `shareReplay()` to share the same observable between multiple subscribers and replay the last emitted value.

14. Be carefull when extend a observable. You can break the chain of operators.

15. Make observable hot only when needed. Use `share()` to share the same observable between multiple subscribers. Use `shareReplay()` to share the same observable between multiple subscribers and replay the last emitted value.

16. Use takeUntil() to unsubscribe from an observable automatically. Combine it with `interval()` to implement a timer or with subject to implement a custom timer.

17. Use `take()` to limit the number of emitted values.

18. Use `debounceTime()` to limit the number of emitted values.

19. Use `distinctUntilChanged()` to avoid emitting the same value multiple times.

20. Combine switchMap with a subject to implement pause and resume behavior. The subject emmit a value when the user click on a button. The switchMap will cancel the previous observable and will start a new one when the subject emits a value.
