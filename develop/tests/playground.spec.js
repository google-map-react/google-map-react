/* eslint-disable max-len */
// `npm bin`/mocha --compilers js:babel-register --require babel-polyfill --reporter min --watch './develop/**/*.spec.js'
/* eslint-enable max-len */
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/distinctUntilChanged';

describe('Playground', () => {
  it('Play', async () => {
    const comparator = (a, b) => a === b;
    const props$ = new BehaviorSubject(1).distinctUntilChanged(comparator);

    props$.subscribe(v => console.log(v)); // eslint-disable-line
    props$.next(1);
    props$.next(2);
    props$.next(1);
  });
});
