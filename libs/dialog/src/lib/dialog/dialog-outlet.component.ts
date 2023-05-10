import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  inject,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  signal,
  Type,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import {
  DEFAULT_DIALOG_CONFIG,
  DialogComponentConfig,
  DialogConfig,
} from './dialog-config';
import { DialogRef } from './dialog-ref';
import { DialogComponent } from './dialog.component';
import { DialogService } from './dialog.service';

@Component({
  selector: 'ngx-dialog-outlet',
  standalone: true,
  imports: [CommonModule, DialogComponent],
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  template: `
    <ngx-dialog
      #dialog
      [contentClass]="config().contentClass"
      [horizontalMargin]="config().horizontalMargin"
      [verticalMargin]="config().verticalMargin"
      [blockScroll]="config().blockScroll"
      [closeOnBackdropClick]="config().closeOnBackdropClick"
      [closeOnEscapeKeyDown]="config().closeOnEscapeKeyDown"
      [focusAutoCapture]="config().focusAutoCapture"
      (closed)="handleCloseDialog($event)"
    >
      <ng-template
        *ngComponentOutlet="component(); injector: componentInjector()!"
      ></ng-template>
    </ngx-dialog>
  `,
})
export class DialogOutletComponent implements OnInit, OnDestroy {
  @ViewChild('dialog', { static: true }) dialog!: DialogComponent;

  public config: WritableSignal<DialogComponentConfig> = signal(
    DEFAULT_DIALOG_CONFIG
  );

  private readonly _dialogService = inject(DialogService);
  private readonly _injector = inject(Injector);
  private readonly _cdr = inject(ChangeDetectorRef);

  protected component = signal<Type<any> | null>(null);
  protected componentInjector = signal<Injector | null>(null);

  private readonly _destroyed$ = new ReplaySubject<void>(1);
  public readonly destroyed$ = this._destroyed$.asObservable();

  private readonly _closed$ = new Subject<any>();
  public readonly closed$ = this._closed$.pipe(takeUntil(this.destroyed$));

  ngOnInit() {
    this._dialogService.registerDialogOutlet(this);
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
  }

  public open<TDialogResult>(component: Type<any>, config: DialogConfig) {
    config = {
      ...DEFAULT_DIALOG_CONFIG,
      ...config,
    };

    const dialogRef = new DialogRef<TDialogResult>(this);
    const providers = config.providers ?? [];
    const injector = Injector.create({
      providers: [
        ...providers,
        {
          provide: DialogRef,
          useValue: dialogRef,
        },
      ],
      parent: this._injector,
    });

    this.updateConfig(config);
    this.component.set(component);
    this.componentInjector.set(injector);
    this.dialog.open();

    return dialogRef;
  }

  public updateConfig(config: DialogConfig) {
    this.config.set(config as DialogComponentConfig);
    this._cdr.detectChanges();
  }

  protected handleCloseDialog(result?: any) {
    this.config.set(DEFAULT_DIALOG_CONFIG);
    this.component.set(null);
    this.componentInjector.set(null);

    this._closed$.next(result);
  }
}
