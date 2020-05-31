import Macros from './macros';

describe('Macros', () => {
  afterEach(() => {
    Macros.reset();
  });

  describe('initialize', () => {
    test('initializes the macros', () => {
      const macros = {
        "Can Play Wind's Requiem": "Wind Waker & Wind's Requiem",
      };

      Macros.initialize(macros);

      expect(Macros.macros).toEqual(macros);
    });
  });

  describe('getMacro', () => {
    test('returns the value of a macro', () => {
      Macros.macros = {
        "Can Play Wind's Requiem": "Wind Waker & Wind's Requiem",
      };

      const macroValue = Macros.getMacro("Can Play Wind's Requiem");

      expect(macroValue).toEqual("Wind Waker & Wind's Requiem");
    });
  });

  describe('setMacro', () => {
    test('sets the value of a macro', () => {
      Macros.macros = {
        "Can Play Wind's Requiem": "Wind Waker & Wind's Requiem",
      };

      Macros.setMacro("Can Play Wind's Requiem", 'Mirror Shield');

      expect(Macros.macros["Can Play Wind's Requiem"]).toEqual('Mirror Shield');
    });
  });
});
