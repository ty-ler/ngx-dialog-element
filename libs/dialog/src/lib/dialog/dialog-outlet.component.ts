import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  inject,
  Injector,
  OnDestroy,
  OnInit,
  QueryList,
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
  index: number;
  config: DialogComponentConfig;
  component: Type<any>;
  componentInjector: Injector;
}

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
      *ngFor="let config of configs; let i = index"
      #dialog
      [contentClass]="config.contentClass"
      [horizontalMargin]="config.horizontalMargin"
      [verticalMargin]="config.verticalMargin"
      [blockScroll]="config.blockScroll"
      [closeOnBackdropClick]="config.closeOnBackdropClick"
      [closeOnEscapeKeyDown]="config.closeOnEscapeKeyDown"
      [focusAutoCapture]="config.focusAutoCapture"
    >
      <ng-template
        *ngComponentOutlet="
          components[i] ?? null;
          injector: componentInjectors[i]
        "
      ></ng-template>
    </ngx-dialog>
  `,
})
export class DialogOutletComponent implements OnInit, OnDestroy {
  @ViewChildren(DialogComponent) dialogs!: QueryList<DialogComponent>;

  public readonly configs: DialogComponentConfig[] = [];
  public readonly components: (Type<any> | null)[] = [];
  public readonly componentInjectors: Injector[] = [];

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

    this.configs.push(config as DialogComponentConfig);

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

    this.components.push(component);
    this.componentInjectors.push(componentInjector);

    dialog.open();
    dialog.closed.pipe(takeUntil(this._destroyed$), take(1)).subscribe(() => {
      this._delete(index);
    });

    return dialogRef;
  }

  public closeAll() {
    this.dialogs.forEach((dialog) => dialog.close());
  }

  public getConfig(index: number) {
    const config = this.configs[index];
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
    this.configs[index] = updatedConfig;
  }

  private _delete(index: number) {
    this.configs.splice(index, 1);
    this.components.splice(index, 1);
    this.componentInjectors.splice(index, 1);
  }
}
