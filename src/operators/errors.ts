import { Observable, take } from 'rxjs';

const ob$ = new Observable(observer => {
  console.log('Start observable');

  let count = 0;

  const intervalId = setInterval(() => {
    console.log('Emit count', count);
    observer.next(count++);
  }, 1000);

  // Throw an error
  setTimeout(() => {
    observer.error(new Error('Timeout!!'));
  }, 2000);

  return () => clearInterval(intervalId);
});

const subs = ob$.pipe(take(5)).subscribe({
  next: console.log,
  error: error => console.log('Error is', error.message),
  complete: () => console.log('Complete!')
});
