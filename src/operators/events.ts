import { fromEvent, fromEventPattern } from 'rxjs';

console.log('From events operators');

const clickMe = document.getElementById('clickme');

function addEventHandler(handler: () => void) {
  document.addEventListener('click', handler);
}

function removeEventHandler(handler: () => void) {
  document.addEventListener('click', handler);
}

const obs$ = fromEventPattern(addEventHandler, removeEventHandler);

const subs = obs$.subscribe({
  next: evt => console.log('Event document click', evt),
  complete: () => console.log('FromEventPattern complete!') // Never run
});

// setTimeout(() => subs.unsubscribe(), 5000);

const obsButton$ = fromEvent(clickMe, 'click', { capture: true });

const subs2 = obsButton$.subscribe({
  next: evt => console.log('Event button click', evt),
  complete: () => console.log('FromEvent complete!') // Never run
});

// setTimeout(() => subs2.unsubscribe(), 5000);
