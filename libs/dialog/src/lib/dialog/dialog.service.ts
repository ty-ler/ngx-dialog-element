import { Injectable, Type } from '@angular/core';
import { DialogConfig } from './dialog-config';
import { DialogOutletComponent } from './dialog-outlet.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private _dialogOutletComponent: DialogOutletComponent | null = null;

  public open<TDialogData = any, TDialogResult = any>(
    component: Type<any>,
    config: DialogConfig<TDialogData>
  ) {
    if (!this._dialogOutletComponent) {
      throw new Error(
        "No dialog outlet registered. Add a DialogOutletComponent somewhere in the app's AppComponent."
      );
    }

    return this._dialogOutletComponent.open<TDialogData, TDialogResult>(
      component,
      config
    );
  }

  public closeAll() {
    if (!this._dialogOutletComponent) {
      throw new Error(
        "No dialog outlet registered. Add a DialogOutletComponent somewhere in the app's AppComponent."
      );
    }

    this._dialogOutletComponent.closeAll();
  }

  public registerDialogOutlet(dialogOutletComponent: DialogOutletComponent) {
    this._dialogOutletComponent = dialogOutletComponent;
  }
}
