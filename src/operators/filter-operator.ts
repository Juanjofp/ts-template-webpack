/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { interval, fromEvent, takeUntil } from 'rxjs';

// const clickMe = document.getElementById('clickme')!;

const stopMe = document.getElementById('stopme')!;

// const clickMeObs$ = fromEvent(clickMe, 'click');

const stopMeObs$ = fromEvent(stopMe, 'click');

// const result = clickMeObs$.pipe(
//   tap(() => console.log('Clicked!!')),
//   switchMap(() => {
//     return interval(1000).pipe(takeUntil(stopMeObs$));
//   })
// );

const result = interval(1000).pipe(takeUntil(stopMeObs$));

result.subscribe({
  next: value => console.log('Value', value),
  complete: () => console.log('Completed!')
});
