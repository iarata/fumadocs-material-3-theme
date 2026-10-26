import { M3eButton } from '@m3e/react/button';
import { M3eIconButton } from '@m3e/react/icon-button';
import type { ComponentProps } from 'react';

export function Button(props: ComponentProps<typeof M3eButton>) {
  return <M3eButton size="small" shape="rounded" variant="text" type="button" {...props} />;
}

export function IconButton(props: ComponentProps<typeof M3eIconButton>) {
  return <M3eIconButton size="small" shape="rounded" variant="standard" type="button" {...props} />;
}
