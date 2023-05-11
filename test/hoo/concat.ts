import { fromEvent } from 'rxjs';

console.log('ConcatAll operator');

const clicks$ = fromEvent(window, 'click');

const result$ = clicks$;

result$.subscribe({
  next: value => console.log('Value', value),
  error: error => console.log('Error', error),
  complete: () => console.log('Complete')
});
