import { Observable, take } from 'rxjs';

console.log('VS Generators');

// Generator
function* genSample() {
  console.log('Start generator');

  let count = 0;

  while (true) {
    yield count++;
  }
}

const gen = genSample();

console.log(gen.next().value);
console.log(gen.next().value);
console.log(gen.next().value);
console.log(gen.next().value);
console.log(gen.next().value);

// Observables

const ob$ = new Observable(observer => {
  console.log('Start observable');

  let count = 0;

  const intervalId = setInterval(() => {
    console.log('Emit count', count);
    observer.next(count++);
  }, 2000);

  return () => clearInterval(intervalId);
});

const subs = ob$.pipe(take(5)).subscribe({
  next: console.log
});
