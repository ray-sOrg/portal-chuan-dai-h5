declare module 'pulltorefreshjs/dist/index.esm.js' {
  interface PullToRefreshOptions {
    mainElement: string | Element;
    onRefresh: () => Promise<void>;
    threshold?: number;
    distTrigger?: number;
    distMax?: number;
    distResisted?: number;
    distIgnore?: number;
    fixomentum?: boolean;
    bypassWindow?: boolean;
    dragInterval?: number;
    pulseDuration?: number;
    pulseEasing?: string;
    reloadHook?: string;
    shouldPull?: () => boolean;
    shouldBypass?: () => boolean;
    onStateChange?: (state: string) => void;
    onInit?: (instance: any) => void;
    classPrefix?: string;
    getMarkup?: () => string;
    // Legacy aliases
    distThreshold?: number;
  }

  interface PullToRefreshInstance {
    destroy(): void;
  }

  function PullToRefresh(options: PullToRefreshOptions): PullToRefreshInstance;
  export default PullToRefresh;
}
