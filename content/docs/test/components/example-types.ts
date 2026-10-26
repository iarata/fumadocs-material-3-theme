/** Options for a documentation guide. */
export interface GuideOptions {
  /** The title displayed at the top of the guide. */
  title: string;
  /** The visual emphasis of the guide card. @defaultValue 'filled' */
  variant?: 'filled' | 'outlined' | 'elevated';
  /** Whether readers can open several sections. @defaultValue false */
  multiple?: boolean;
  /** Called when a reader completes the guide. */
  onComplete?: (page: string) => void;
  /** @internal */
  internalCache?: Map<string, unknown>;
}
