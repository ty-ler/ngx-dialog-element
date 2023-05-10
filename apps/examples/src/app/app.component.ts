import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  DialogComponent,
  DialogOutletComponent,
  DialogService,
} from '@ngx-native-dialog/dialog';
import { DialogTestComponent } from './dialog-test.component';
import { DialogTestService } from './dialog-test.service';

@Component({
  standalone: true,
  selector: 'ngx-native-dialog-root',
  imports: [
    CommonModule,
    A11yModule,
    RouterModule,
    DialogComponent,
    DialogOutletComponent,
    DialogTestComponent,
  ],
  template: `
    <ngx-dialog
      #dialog
      [focusAutoCapture]="true"
      [closeOnEscapeKeyDown]="false"
      contentClass="tw-flex tw-flex-col tw-bg-white tw-border tw-border-gray-300 tw-shadow tw-shadow-gray-400 tw-rounded-md"
      (backdropClicked)="handleClickBackdrop($event)"
      (closed)="handleDialogClosed($event)"
    >
      <div><input /></div>
      <div class="tw-flex tw-justify-end tw-items-center tw-gap-2 tw-mt-4">
        <button
          type="button"
          class="tw-bg-blue-500"
          (click)="handleClickConfirm(dialog)"
        >
          Confirm
        </button>
        <button
          type="button"
          class="tw-bg-red-500"
          (click)="handleClickCancel(dialog)"
        >
          Cancel
        </button>
      </div>
    </ngx-dialog>

    <div class="tw-flex tw-flex-col tw-gap-2">
      <button (click)="dialog.open()">Open dialog</button>
      <button (click)="openDialogComponent()">Open dialog (outlet)</button>
    </div>

    <div class="tw-mt-[2000px] tw-bg-blue-500 tw-w-8 tw-h-8"></div>
    <ngx-dialog-outlet></ngx-dialog-outlet>
  `,
})
export class AppComponent {
  title = 'examples';

  private readonly _dialogService = inject(DialogService);

  protected openDialogComponent() {
    const ref = this._dialogService.open(DialogTestComponent, {
      contentClass: '!tw-bg-blue-500',
      // closeOnBackdropClick: false,
      // closeOnEscapeKeyDown: false,
      blockScroll: false,
      providers: [
        {
          provide: DialogTestService,
        },
      ],
    });

    ref.closed$.subscribe((result) => {
      console.log(result);
    });
  }

  protected handleClickConfirm(dialog: DialogComponent) {
    dialog.close('yes');
  }

  protected handleClickCancel(dialog: DialogComponent) {
    dialog.close('no');
  }

  protected handleClickBackdrop(e: MouseEvent) {
    console.log('Dialog backdrop clicked:', e);
  }

  protected handleDialogClosed(result: any) {
    console.log('Dialog closed, result:', result);
  }
}
