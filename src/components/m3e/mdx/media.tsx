'use client';

import { createPortal } from 'react-dom';
import { useEffect, useId, useRef, useState, type ComponentProps } from 'react';
import { Button, Icon, IconButton } from './actions';

export function ImageZoom({ alt = '', src, className, ...props }: ComponentProps<'img'>) {
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const dialog = useRef<HTMLDialogElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    const element = dialog.current;
    if (!open || !element) return;
    element.showModal();
    return () => { if (element.open) element.close(); };
  }, [open]);

  useEffect(() => {
    const element = viewport.current;
    if (element) element.scrollTo({ left: (element.scrollWidth - element.clientWidth) / 2, top: (element.scrollHeight - element.clientHeight) / 2 });
  }, [scale, open]);

  return <span className="docs-image-zoom not-prose">
    <button type="button" className="docs-image-trigger" aria-label={`Enlarge image${alt ? `: ${alt}` : ''}`} aria-haspopup="dialog" aria-controls={id} onClick={() => { setScale(1); setOpen(true); }}>
      <img {...props} src={src} alt={alt} className={className} loading={props.loading ?? 'lazy'} />
      <span className="docs-image-affordance"><Icon name="ExternalLink" />Enlarge</span>
    </button>
    {/* A portal keeps the full-screen surface outside MDX paragraphs and layout containment. */}
    {open && createPortal(<dialog ref={dialog} id={id} className="docs-image-dialog not-prose" aria-labelledby={`${id}-title`} onClose={() => setOpen(false)}>
      <header className="docs-image-toolbar">
        <IconButton icon="X" label="Close image" onClick={() => dialog.current?.close()} />
        <span id={`${id}-title`}>{alt || 'Image preview'}</span>
      </header>
      <div ref={viewport} className="docs-image-viewport" tabIndex={0} aria-label="Image canvas" onDoubleClick={() => setScale(current => current === 1 ? 2 : 1)}>
        <div className="docs-image-stage" style={{ width: `${scale * 100}%`, height: `${scale * 100}%` }}>
          <img src={src} srcSet={props.srcSet} sizes={props.sizes} alt={alt} draggable={false} />
        </div>
      </div>
      <footer className="docs-image-controls">
        <Button size="extra-small" disabled={scale <= 1} onClick={() => setScale(current => Math.max(1, current - 0.5))} aria-label="Zoom out">−</Button>
        <span aria-live="polite">{Math.round(scale * 100)}%</span>
        <Button size="extra-small" disabled={scale >= 4} onClick={() => setScale(current => Math.min(4, current + 0.5))} aria-label="Zoom in">+</Button>
        <Button size="extra-small" variant="tonal" icon="RefreshCw" aria-label="Fit image to screen" onClick={() => setScale(1)}>Fit</Button>
      </footer>
    </dialog>, document.body)}
  </span>;
}
