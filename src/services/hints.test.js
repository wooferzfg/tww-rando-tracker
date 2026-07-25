import Hints from './hints';

describe('Hints', () => {
  describe('isGoal', () => {
    describe('when the location is a dungeon with a boss', () => {
      test('returns true', () => {
        expect(Hints.isGoal('Dragon Roost Cavern')).toEqual(true);
      });
    });

    describe('when the location is Hyrule', () => {
      test('returns true', () => {
        expect(Hints.isGoal('Hyrule')).toEqual(true);
      });
    });

    describe("when the location is Ganon's Tower", () => {
      test('returns true', () => {
        expect(Hints.isGoal("Ganon's Tower")).toEqual(true);
      });
    });

    describe('when the location is not a goal', () => {
      test('returns false', () => {
        expect(Hints.isGoal('The Great Sea')).toEqual(false);
      });
    });
  });

  describe('goalName', () => {
    test('returns the boss name for a dungeon', () => {
      expect(Hints.goalName('Forbidden Woods')).toEqual('Kalle Demos');
    });

    describe('when the location is not a goal', () => {
      test('returns the location name', () => {
        expect(Hints.goalName('The Great Sea')).toEqual('The Great Sea');
      });
    });
  });

  describe('selection factories', () => {
    test('goalSelection returns a goal selection', () => {
      expect(Hints.goalSelection('Wind Temple')).toEqual({
        type: 'goal',
        goal: 'Wind Temple',
      });
    });

    test('itemSelection returns an item selection', () => {
      expect(Hints.itemSelection('Deku Leaf')).toEqual({
        type: 'item',
        itemName: 'Deku Leaf',
      });
    });

    test('locationSelection defaults the detailed location to null', () => {
      expect(Hints.locationSelection('Windfall Island')).toEqual({
        type: 'location',
        generalLocation: 'Windfall Island',
        detailedLocation: null,
      });
    });

    test('locationSelection keeps the detailed location', () => {
      expect(Hints.locationSelection('Windfall Island', "Maggie's Father")).toEqual({
        type: 'location',
        generalLocation: 'Windfall Island',
        detailedLocation: "Maggie's Father",
      });
    });
  });

  describe('applySelection', () => {
    const goal = Hints.goalSelection('Dragon Roost Cavern');
    const item = Hints.itemSelection('Deku Leaf');
    const zone = Hints.locationSelection('Windfall Island');
    const check = Hints.locationSelection('Windfall Island', "Maggie's Father");

    describe('when there is no pending selection', () => {
      test.each([
        ['a goal', goal],
        ['an item', item],
        ['a location', zone],
      ])('stores %s as pending', (_label, selection) => {
        expect(Hints.applySelection(null, selection)).toEqual({
          itemHint: null,
          pathHint: null,
          pendingSelection: selection,
        });
      });
    });

    describe('when a goal is pending', () => {
      test('completes a path hint when a zone is clicked', () => {
        expect(Hints.applySelection(goal, zone)).toEqual({
          itemHint: null,
          pathHint: { zone: 'Windfall Island', goal: 'Dragon Roost Cavern' },
          pendingSelection: null,
        });
      });

      test('completes a zone level path hint when a check is clicked', () => {
        expect(Hints.applySelection(goal, check)).toEqual({
          itemHint: null,
          pathHint: { zone: 'Windfall Island', goal: 'Dragon Roost Cavern' },
          pendingSelection: null,
        });
      });

      test('replaces the pending selection when another goal is clicked', () => {
        const newGoal = Hints.goalSelection('Wind Temple');

        expect(Hints.applySelection(goal, newGoal)).toEqual({
          itemHint: null,
          pathHint: null,
          pendingSelection: newGoal,
        });
      });

      test('replaces the pending selection when an item is clicked', () => {
        expect(Hints.applySelection(goal, item)).toEqual({
          itemHint: null,
          pathHint: null,
          pendingSelection: item,
        });
      });
    });

    describe('when an item is pending', () => {
      test('completes a zone level item hint when a zone is clicked', () => {
        expect(Hints.applySelection(item, zone)).toEqual({
          itemHint: {
            itemName: 'Deku Leaf',
            generalLocation: 'Windfall Island',
            detailedLocation: null,
          },
          pathHint: null,
          pendingSelection: null,
        });
      });

      test('completes a detailed item hint when a check is clicked', () => {
        expect(Hints.applySelection(item, check)).toEqual({
          itemHint: {
            itemName: 'Deku Leaf',
            generalLocation: 'Windfall Island',
            detailedLocation: "Maggie's Father",
          },
          pathHint: null,
          pendingSelection: null,
        });
      });

      test('replaces the pending selection when another item is clicked', () => {
        const newItem = Hints.itemSelection('Bombs');

        expect(Hints.applySelection(item, newItem)).toEqual({
          itemHint: null,
          pathHint: null,
          pendingSelection: newItem,
        });
      });
    });

    describe('when a location is pending', () => {
      test('completes a path hint when a goal is clicked', () => {
        expect(Hints.applySelection(check, goal)).toEqual({
          itemHint: null,
          pathHint: { zone: 'Windfall Island', goal: 'Dragon Roost Cavern' },
          pendingSelection: null,
        });
      });

      test('completes an item hint when an item is clicked', () => {
        expect(Hints.applySelection(check, item)).toEqual({
          itemHint: {
            itemName: 'Deku Leaf',
            generalLocation: 'Windfall Island',
            detailedLocation: "Maggie's Father",
          },
          pathHint: null,
          pendingSelection: null,
        });
      });

      test('replaces the pending selection when another location is clicked', () => {
        expect(Hints.applySelection(zone, check)).toEqual({
          itemHint: null,
          pathHint: null,
          pendingSelection: check,
        });
      });
    });
  });

  describe('locationText', () => {
    test('returns the general location when there is no detailed location', () => {
      expect(Hints.locationText('Windfall Island', null)).toEqual('Windfall Island');
    });

    test('returns both locations when there is a detailed location', () => {
      expect(Hints.locationText('Windfall Island', "Maggie's Father")).toEqual("Windfall Island - Maggie's Father");
    });
  });

  describe('pathHintText', () => {
    test('returns the zone and the goal name', () => {
      const hintText = Hints.pathHintText({ zone: 'Windfall Island', goal: 'Earth Temple' });

      expect(hintText).toEqual('Windfall Island → Jalhalla');
    });
  });
});
