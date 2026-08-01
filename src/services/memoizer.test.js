import Memoizer from './memoizer';

describe('Memoizer', () => {
  let MockClass;

  beforeEach(() => {
    MockClass = class {
      constructor(mockInitialValue) {
        this.mockInitialValue = mockInitialValue;
      }

      static mockStaticMethod(mockParam) {
        return this.mockStaticMethodHelper(mockParam);
      }

      static mockStaticMethodHelper(mockParam) {
        if (!this.previousValue) {
          this.previousValue = mockParam;
          return `First! param:${mockParam}`;
        }
        return `Repeated! param:${mockParam} previousValue:${this.previousValue}`;
      }

      mockInstanceMethod(mockParam) {
        if (!this.previousValue) {
          this.previousValue = mockParam;
          return `First! param:${mockParam} initialValue:${this.mockInitialValue}`;
        }
        return `Repeated! param:${mockParam} previousValue:${this.previousValue} initialValue:${this.mockInitialValue}`;
      }
    };

    // this simulates functions in minified production code, which do not have a name attribute
    MockClass.mockStaticMethod2 = (mockParam) => (
      `Method 2! ${MockClass.mockStaticMethodHelper(mockParam)}`
    );
  });

  describe('when calling a static method', () => {
    describe('when the static method is memoized', () => {
      beforeEach(() => {
        Memoizer.memoize(MockClass, ['mockStaticMethod']);
      });

      test('returns the same value when the method is called twice with the same parameter', () => {
        const firstResult = MockClass.mockStaticMethod(5);
        const secondResult = MockClass.mockStaticMethod(5);

        expect(firstResult).toEqual('First! param:5');
        expect(secondResult).toEqual('First! param:5');
      });

      test('returns different values when the method is called twice with different parameters', () => {
        const firstResult = MockClass.mockStaticMethod(5);
        const secondResult = MockClass.mockStaticMethod(13);

        expect(firstResult).toEqual('First! param:5');
        expect(secondResult).toEqual('Repeated! param:13 previousValue:5');
      });
    });

    describe('when a static method is memoized, called, and then invalidated', () => {
      beforeEach(() => {
        Memoizer.memoize(MockClass, ['mockStaticMethod']);

        MockClass.previousValue = 'yeet';
        MockClass.mockStaticMethod(5);

        Memoizer.invalidate([MockClass.mockStaticMethod]);

        MockClass.previousValue = null;
      });

      test('clears memoized values', () => {
        const firstResult = MockClass.mockStaticMethod(5);
        const secondResult = MockClass.mockStaticMethod(5);

        expect(firstResult).toEqual('First! param:5');
        expect(secondResult).toEqual('First! param:5');
      });
    });

    describe('when a static method is memoized, called, and then invalidated twice', () => {
      beforeEach(() => {
        Memoizer.memoize(MockClass, ['mockStaticMethod']);

        MockClass.previousValue = 'yeet';
        MockClass.mockStaticMethod(5);

        Memoizer.invalidate([MockClass.mockStaticMethod]);

        Memoizer.memoize(MockClass, ['mockStaticMethod']);

        MockClass.previousValue = 'yeet';
        MockClass.mockStaticMethod(5);

        Memoizer.invalidate([MockClass.mockStaticMethod]);

        MockClass.previousValue = null;
      });

      test('clears memoized values', () => {
        const firstResult = MockClass.mockStaticMethod(5);
        const secondResult = MockClass.mockStaticMethod(5);

        expect(firstResult).toEqual('First! param:5');
        expect(secondResult).toEqual('First! param:5');
      });
    });

    describe('when multiple static methods are memoized', () => {
      beforeEach(() => {
        Memoizer.memoize(MockClass, [
          'mockStaticMethod',
          'mockStaticMethod2',
        ]);
      });

      test('returns the same value when each method is called twice with the same parameter', () => {
        const firstResultMethod1 = MockClass.mockStaticMethod(5);
        const secondResultMethod1 = MockClass.mockStaticMethod(5);
        MockClass.previousValue = null;
        const firstResultMethod2 = MockClass.mockStaticMethod2(5);
        const secondResultMethod2 = MockClass.mockStaticMethod2(5);

        expect(firstResultMethod1).toEqual('First! param:5');
        expect(secondResultMethod1).toEqual('First! param:5');
        expect(firstResultMethod2).toEqual('Method 2! First! param:5');
        expect(secondResultMethod2).toEqual('Method 2! First! param:5');
      });
    });

    describe('when a method is invalidated immediately', () => {
      test('does not do anything to the method', () => {
        Memoizer.invalidate([MockClass.mockStaticMethod]);
      });
    });
  });

  describe('when calling an instance method', () => {
    let mockInstance;

    beforeEach(() => {
      mockInstance = new MockClass(2);
    });

    describe('when the instance method is memoized', () => {
      beforeEach(() => {
        Memoizer.memoize(mockInstance, ['mockInstanceMethod']);
      });

      test('returns the same value when the method is called twice with the same parameter', () => {
        const firstResult = mockInstance.mockInstanceMethod(5);
        const secondResult = mockInstance.mockInstanceMethod(5);

        expect(firstResult).toEqual('First! param:5 initialValue:2');
        expect(secondResult).toEqual('First! param:5 initialValue:2');
      });

      test('returns different values when the method is called twice with different parameters', () => {
        const firstResult = mockInstance.mockInstanceMethod(5);
        const secondResult = mockInstance.mockInstanceMethod(13);

        expect(firstResult).toEqual('First! param:5 initialValue:2');
        expect(secondResult).toEqual('Repeated! param:13 previousValue:5 initialValue:2');
      });
    });
  });
});
