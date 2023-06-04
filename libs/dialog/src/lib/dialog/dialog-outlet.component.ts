import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  inject,
  Injector,
  OnInit,
  QueryList,
  runInInjectionContext,
  signal,
  Type,
  ViewChildren,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { take } from 'rxjs';
import {
  DEFAULT_DIALOG_CONFIG,
  DialogComponentConfig,
  DialogConfig,
} from './dialog-config';
import { DialogOutletService } from './dialog-outlet.service';
import { DialogRef } from './dialog-ref';
import { DialogComponent } from './dialog.component';

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
export class DialogOutletComponent implements OnInit {
  @ViewChildren(DialogComponent) dialogs!: QueryList<DialogComponent>;

  private readonly _dialogEntries = signal<ComponentDialogEntry[]>([]);
  public readonly dialogEntries = this._dialogEntries.asReadonly();

  private readonly _dialogOutletService = inject(DialogOutletService);
  private readonly _injector = inject(Injector);
  private readonly _cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this._dialogOutletService.registerDialogOutlet(this);
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

    runInInjectionContext(this._injector, () => {
      dialog.closed.pipe(takeUntilDestroyed(), take(1)).subscribe(() => {
        this._delete(index);
      });
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
