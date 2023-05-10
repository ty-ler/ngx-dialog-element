import { Injectable, Type } from '@angular/core';
import { DialogConfig } from './dialog-config';
import { DialogOutletComponent } from './dialog-outlet.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private _dialogOutletComponent: DialogOutletComponent | null = null;

  public open<TDialogResult = any>(component: Type<any>, config: DialogConfig) {
    if (!this._dialogOutletComponent) {
      throw new Error(
        "No dialog outlet registered. Add a DialogOutletComponent somewhere in the app's AppComponent."
      );
    }

    return this._dialogOutletComponent.open<TDialogResult>(component, config);
  }

  public registerDialogOutlet(dialogOutletComponent: DialogOutletComponent) {
    this._dialogOutletComponent = dialogOutletComponent;
  }
}
