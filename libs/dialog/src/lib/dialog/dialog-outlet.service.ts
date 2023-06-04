import { Injectable } from '@angular/core';
import { DialogOutletComponent } from './dialog-outlet.component';

@Injectable({
  providedIn: 'root',
})
export class DialogOutletService {
  private _dialogOutletComponent: DialogOutletComponent | null = null;

  public registerDialogOutlet(dialogOutletComponent: DialogOutletComponent) {
    this._dialogOutletComponent = dialogOutletComponent;
  }

  public getDialogOutlet() {
    return this._dialogOutletComponent;
  }
}
