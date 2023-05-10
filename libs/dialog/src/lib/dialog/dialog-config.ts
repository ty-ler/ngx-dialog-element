import { StaticProvider } from '@angular/core';

export type DialogComponentConfig = {
  contentClass: string | null;
  horizontalMargin: string;
  verticalMargin: string;
  blockScroll: boolean;
  closeOnBackdropClick: boolean;
  closeOnEscapeKeyDown: boolean;
  focusAutoCapture: boolean;
};

export type DialogConfig<TDialogData = any> = Partial<DialogComponentConfig> & {
  data?: TDialogData;
  providers?: StaticProvider[];
};

export const DEFAULT_DIALOG_CONFIG: DialogComponentConfig = {
  blockScroll: true,
  closeOnBackdropClick: true,
  closeOnEscapeKeyDown: true,
  contentClass: null,
  focusAutoCapture: true,
  horizontalMargin: '2rem',
  verticalMargin: '2rem',
};
