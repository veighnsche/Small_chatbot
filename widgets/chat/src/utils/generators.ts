function pipe<A, B, C, D, E, F>(
  f1: (arg: A) => IterableIterator<B>,
  f2: (arg: IterableIterator<B>) => IterableIterator<C>,
  f3: (arg: IterableIterator<C>) => IterableIterator<D>,
  f4: (arg: IterableIterator<D>) => IterableIterator<E>,
  f5: (arg: IterableIterator<E>) => IterableIterator<F>,
): (arg: A) => IterableIterator<F>;

function pipe<A, B, C, D, E>(
  f1: (arg: A) => IterableIterator<B>,
  f2: (arg: IterableIterator<B>) => IterableIterator<C>,
  f3: (arg: IterableIterator<C>) => IterableIterator<D>,
  f4: (arg: IterableIterator<D>) => IterableIterator<E>,
): (arg: A) => IterableIterator<E>;

function pipe<A, B, C, D>(
  f1: (arg: A) => IterableIterator<B>,
  f2: (arg: IterableIterator<B>) => IterableIterator<C>,
  f3: (arg: IterableIterator<C>) => IterableIterator<D>,
): (arg: A) => IterableIterator<D>;

function pipe<A, B, C>(
  f1: (arg: A) => IterableIterator<B>,
  f2: (arg: IterableIterator<B>) => IterableIterator<C>,
): (arg: A) => IterableIterator<C>;

function pipe<A, B>(
  f1: (arg: A) => IterableIterator<B>,
): (arg: A) => IterableIterator<B>;

function pipe(...fns: Function[]) {
  return function* (initial: any) {
    let result: IterableIterator<any> = fns[0](initial);

    for (let i = 1; i < fns.length; i++) {
      result = fns[i](result);
    }

    yield* result;
  };
}
