import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  inject,
  Injector,
  OnDestroy,
  OnInit,
  QueryList,
  signal,
  Type,
  ViewChildren,
} from '@angular/core';
import { ReplaySubject, take, takeUntil } from 'rxjs';
import {
  DEFAULT_DIALOG_CONFIG,
  DialogComponentConfig,
  DialogConfig,
} from './dialog-config';
import { DialogRef } from './dialog-ref';
import { DialogComponent } from './dialog.component';
import { DialogService } from './dialog.service';

interface ComponentDialogEntry {
  config: DialogComponentConfig;
  component?: Type<any>;
  componentInjector?: Injector;
}

@Component({
  selector: 'ngx-dialog-outlet',
  standalone: true,
  imports: [CommonModule, DialogComponent],
  template: `
    <ngx-dialog
      *ngFor="let entry of dialogEntries()"
      #dialog
      [contentClass]="entry.config.contentClass"
      [horizontalMargin]="entry.config.horizontalMargin"
      [verticalMargin]="entry.config.verticalMargin"
      [blockScroll]="entry.config.blockScroll"
      [closeOnBackdropClick]="entry.config.closeOnBackdropClick"
      [closeOnEscapeKeyDown]="entry.config.closeOnEscapeKeyDown"
      [focusAutoCapture]="entry.config.focusAutoCapture"
    >
      <ng-template
        *ngComponentOutlet="
          entry.component ?? null;
          injector: entry.componentInjector
        "
      ></ng-template>
    </ngx-dialog>
  `,
})
export class DialogOutletComponent implements OnInit, OnDestroy {
  @ViewChildren(DialogComponent) dialogs!: QueryList<DialogComponent>;

  private readonly _dialogEntries = signal<ComponentDialogEntry[]>([]);
  public readonly dialogEntries = this._dialogEntries.asReadonly();

  private readonly _dialogService = inject(DialogService);
  private readonly _injector = inject(Injector);
  private readonly _cdr = inject(ChangeDetectorRef);

  private readonly _destroyed$ = new ReplaySubject<void>(1);
  public readonly destroyed$ = this._destroyed$.asObservable();

  ngOnInit() {
    this._dialogService.registerDialogOutlet(this);
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
  }

  public open<TDialogData, TDialogResult>(
    component: Type<any>,
    config: DialogConfig<TDialogData>
  ) {
    config = {
      ...DEFAULT_DIALOG_CONFIG,
      ...config,
    };

    const index = this.dialogs.length;

    this._dialogEntries.mutate((entries) =>
      entries.push({
        config: config as DialogComponentConfig,
      })
    );

    this._cdr.detectChanges();

    const dialog = this.dialogs.get(index);

    if (!dialog) {
      throw new Error('Failed to create component dialog');
    }

    const dialogRef = new DialogRef<TDialogResult>(this, dialog, index);
    const providers = config.providers ?? [];
    const componentInjector = Injector.create({
      providers: [
        ...providers,
        {
          provide: DialogRef,
          useValue: dialogRef,
        },
      ],
      parent: this._injector,
    });

    this._dialogEntries.mutate((entries) => {
      entries[index].component = component;
      entries[index].componentInjector = componentInjector;
    });

    dialog.open();
    dialog.closed.pipe(takeUntil(this.destroyed$), take(1)).subscribe(() => {
      this._delete(index);
    });

    return dialogRef;
  }

  public closeAll() {
    this.dialogs.forEach((dialog) => dialog.close());
  }

  public getConfig(index: number) {
    const config = this.dialogEntries()[index].config;
    if (!config) {
      throw new Error('Failed to find dialog config');
    }

    return config;
  }

  public updateConfig(
    index: number,
    update: (config: DialogConfig) => DialogConfig
  ) {
    const config = this.getConfig(index);
    const updatedConfig = update(config) as DialogComponentConfig;
    this._dialogEntries.mutate(
      (entries) => (entries[index].config = updatedConfig)
    );
  }

  private _delete(index: number) {
    this._dialogEntries.mutate((entries) => entries.splice(index, 1));
  }
}
