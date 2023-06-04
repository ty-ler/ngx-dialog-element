import { inject, Injectable, Type } from '@angular/core';
import { DialogConfig } from './dialog-config';
import { DialogOutletService } from './dialog-outlet.service';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private readonly _dialogOutletService = inject(DialogOutletService);

  public open<TDialogData = any, TDialogResult = any>(
    component: Type<any>,
    config: DialogConfig<TDialogData>
  ) {
    const dialogOutlet = this._dialogOutletService.getDialogOutlet();
    if (!dialogOutlet) {
      throw new Error(
        "No dialog outlet registered. Add a DialogOutletComponent somewhere in the app's AppComponent."
      );
    }

    return dialogOutlet.open<TDialogData, TDialogResult>(component, config);
  }

  public closeAll() {
    const dialogOutlet = this._dialogOutletService.getDialogOutlet();
    if (!dialogOutlet) {
      throw new Error(
        "No dialog outlet registered. Add a DialogOutletComponent somewhere in the app's AppComponent."
      );
    }

    dialogOutlet.closeAll();
  }
}
