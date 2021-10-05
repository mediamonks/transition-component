import { createTransitionController } from './transition.utils';

describe('createTransitionComponent', () => {
  it('Should create timeline for direction when setup function is defined', () => {
    const transitionController = createTransitionController({
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      setupTransitionInTimeline() {},

      // eslint-disable-next-line @typescript-eslint/no-empty-function
      setupTransitionOutTimeline() {},
    });

    expect(transitionController.getTimeline('in')).toBeUndefined();
    expect(transitionController.getTimeline('out')).toBeUndefined();

    transitionController.setupTimeline({
      direction: 'out',
    });

    expect(transitionController.getTimeline('in')).toBeUndefined();
    expect(transitionController.getTimeline('out')).toBeDefined();

    transitionController.setupTimeline({
      direction: 'in',
    });

    expect(transitionController.getTimeline('in')).toBeDefined();
  });

  it('Should throw when creating timeline for direction when setup function is undefined', () => {
    const transitionController = createTransitionController({});

    expect(() =>
      transitionController.setupTimeline({
        direction: 'in',
      }),
    ).toThrow();

    expect(() =>
      transitionController.setupTimeline({
        direction: 'out',
      }),
    ).toThrow();
  });

  it('Should transition in using transition controller', async () => {
    const proxy = {
      value: undefined,
    };

    const transitionController = createTransitionController({
      setupTransitionInTimeline(timeline) {
        timeline.fromTo(proxy, { value: 1 }, { value: 2 });
      },
    });

    transitionController.setupTimeline({
      direction: 'in',
    });

    const transitionIn = transitionController.transitionIn();

    expect(proxy.value).toEqual(1);

    await transitionIn;

    expect(proxy.value).toEqual(2);
  });

  it('Should use reversed transition in when setupTransitionOut is not defined', async () => {
    const proxy = {
      value: undefined,
    };

    const transitionController = createTransitionController({
      setupTransitionInTimeline(timeline) {
        timeline.fromTo(proxy, { value: 1 }, { value: 2 });
      },
    });

    transitionController.setupTimeline({
      direction: 'in',
    });

    const transitionOut = transitionController.transitionOut();

    // Reversed start value
    expect(proxy.value).toEqual(2);

    await transitionOut;

    // Reversed end value
    expect(proxy.value).toEqual(1);

    // Check if out timeline is not created (we should be using the in timeline)
    expect(transitionController.getTimeline('out')).toBeUndefined();
  });
});
