import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  signal,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { A11yModule } from '@angular/cdk/a11y';
import { DEFAULT_DIALOG_CONFIG, DialogComponentConfig } from './dialog-config';

@Component({
  selector: 'ngx-dialog',
  standalone: true,
  // encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, A11yModule],
  template: `
    <dialog
      #dialog
      class="ngx-dialog"
      [ngStyle]="{
        '--ngx-dialog-horizontal-margin': horizontalMargin,
        '--ngx-dialog-vertical-margin': verticalMargin
      }"
      (click)="handleClickDialog($event)"
      (close)="handleCloseDialog()"
    >
      <div
        #content
        *ngIf="isOpen()"
        cdkTrapFocus
        [cdkTrapFocusAutoCapture]="focusAutoCapture"
        [ngClass]="['ngx-dialog-content', contentClass ? contentClass : '']"
      >
        <ng-content></ng-content>
      </div>
    </dialog>
  `,
})
export class DialogComponent implements DialogComponentConfig {
  @ViewChild('dialog', { static: true })
  htmlDialog!: ElementRef<HTMLDialogElement>;

  @ViewChild('content') content: ElementRef<HTMLDivElement> | undefined;

  @Input() contentClass: string | null = DEFAULT_DIALOG_CONFIG.contentClass;
  @Input() horizontalMargin = DEFAULT_DIALOG_CONFIG.horizontalMargin;
  @Input() verticalMargin = DEFAULT_DIALOG_CONFIG.verticalMargin;
  @Input() blockScroll = DEFAULT_DIALOG_CONFIG.blockScroll;
  @Input() closeOnBackdropClick = DEFAULT_DIALOG_CONFIG.closeOnBackdropClick;
  @Input() closeOnEscapeKeyDown = DEFAULT_DIALOG_CONFIG.closeOnEscapeKeyDown;
  @Input() focusAutoCapture = DEFAULT_DIALOG_CONFIG.focusAutoCapture;

  @Output() closed = new EventEmitter<Event>();
  @Output() backdropClicked = new EventEmitter<MouseEvent>();

  private readonly _isOpen = signal(false);
  public readonly isOpen = this._isOpen.asReadonly();

  private _result: any = undefined;

  private get _element() {
    return this.htmlDialog.nativeElement;
  }

  public open() {
    if (this._isOpen()) return;

    this._element.showModal();
    this._isOpen.set(true);

    if (this.blockScroll) {
      document.body.classList.add('ngx-dialog-scroll-blocked');
    }
  }

  public close(result?: any) {
    if (!this._isOpen()) return;

    this._result = result;
    this._isOpen.set(false);
    this._element.close();

    document.body.classList.remove('ngx-dialog-scroll-blocked');
  }

  @HostListener('keydown', ['$event'])
  protected handleKeyDown(e: KeyboardEvent) {
    if (e.code === 'Escape' && !this.closeOnEscapeKeyDown) {
      e.preventDefault();
    }
  }

  protected handleCloseDialog() {
    if (this._isOpen()) {
      this._isOpen.set(false);
    }

    this.closed.emit(this._result);
    this._result = undefined;
  }

  protected handleClickDialog(e: MouseEvent) {
    const { clientX, clientY, pointerId } = e as PointerEvent;
    if (!this.content || pointerId < 0 || !this._isOpen()) return;

    const content = this.content.nativeElement;
    const dialogDimensions = content.getBoundingClientRect();
    if (
      clientX < dialogDimensions.left ||
      clientX > dialogDimensions.right ||
      clientY < dialogDimensions.top ||
      clientY > dialogDimensions.bottom
    ) {
      this.backdropClicked.emit(e);

      if (this.closeOnBackdropClick) {
        this.close();
      }
    }
  }
}
