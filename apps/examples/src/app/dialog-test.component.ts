import {
  Component,
  HostBinding,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { DialogRef, DialogService } from 'ngx-dialog-element';
import { DialogTestService } from './dialog-test.service';

@Component({
  selector: 'ngx-dialog-test',
  standalone: true,
  template: `
    <div><input (input)="handleChangeInput($any($event))" /></div>
    <div class="tw-flex tw-justify-end tw-items-center tw-gap-2">
      <button
        type="button"
        class="!tw-bg-blue-500"
        (click)="handleClickHelloWorldButton()"
      >
        Hello World
      </button>
      <button
        type="button"
        class="!tw-bg-red-500"
        (click)="handleClickCloseButton()"
      >
        Close
      </button>
    </div>
  `,
})
export class DialogTestComponent implements OnInit, OnDestroy {
  @HostBinding('class') _classes = 'tw-flex tw-flex-col tw-gap-2';

  private readonly _service = inject(DialogTestService);
  private readonly _dialogRef = inject(DialogRef);
  private readonly _dialogService = inject(DialogService);
  private readonly _dialogData = this._dialogRef.getConfig().data;

  ngOnInit() {
    console.log(this._dialogRef);
    console.log(this._dialogData);
  }

  ngOnDestroy(): void {
    console.log('destroyed');
  }

  protected handleChangeInput(e: InputEvent) {
    const input = e.target as HTMLInputElement;
    const value = input.value;

    this._dialogRef.updateConfig((config) => {
      config.contentClass = value || null;

      return config;
    });
  }

  protected handleClickHelloWorldButton() {
    this._dialogService.open(DialogTestComponent, {
      providers: [
        {
          provide: DialogTestService,
        },
      ],
    });
  }

  protected handleClickCloseButton() {
    this._dialogRef.close('close');
  }
}
