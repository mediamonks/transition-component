class AnimationsMap extends Map {
  private readonly callbacks = new Set<() => void>();

  private updateQueued = false;

  public set(key: unknown, value: gsap.core.Animation): this {
    const result = super.set(key, value);

    if (this.updateQueued) {
      return result;
    }

    this.updateQueued = true;

    queueMicrotask(() => {
      for (const callback of this.callbacks) {
        callback();
      }

      this.updateQueued = false;
    });

    return result;
  }

  public listen(callback: () => void): () => void {
    this.callbacks.add(callback);

    return () => {
      this.callbacks.delete(callback);
    };
  }
}

/**
 * Global map of animations that can be accessed by reference
 */
export const animations = new AnimationsMap();
