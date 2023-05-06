import { of, from } from 'rxjs';

console.log('Sequence operators');

const obsOf$ = of(1, 2, 3, 4, 5);

obsOf$.subscribe({
  next: console.log,
  complete: () => console.log('Complete of!')
});

const obsFrom$ = from([1, 2, 3, 4, 5]);

obsFrom$.subscribe({
  next: console.log,
  complete: () => console.log('Complete from array!')
});

const promise = new Promise(resolve => {
  setTimeout(() => resolve(42), 3000);
});

const obsFromPromise$ = from(promise);

obsFromPromise$.subscribe({
  next: console.log,
  complete: () => console.log('Complete from promise!')
});

function* generator() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
}

const iterator = generator();

const obsFromGen$ = from(iterator);

obsFromGen$.subscribe({
  next: console.log,
  complete: () => console.log('Complete from gen!')
});
