import { fromEvent, throttleTime } from 'rxjs';

console.log('Throttle operator');

// Throttle emit the first value and then cause
// x milliseconds of silence before next emissions

// I.e.: Emit one event every 2 seconds, dropping
// events in between

const clicks$ = fromEvent<MouseEvent>(window, 'click');

const result$ = clicks$.pipe(throttleTime(2000));

const subscription = result$.subscribe({
  next: val => console.log('Emit', val.clientX),
  complete: () => console.log('Complete')
});
