import { Observable, take } from 'rxjs';
import { DialogConfig } from './dialog-config';
import { DialogOutletComponent } from './dialog-outlet.component';

export class DialogRef<TDialogResult> {
  public readonly closed$: Observable<TDialogResult> =
    this._outletInstance.closed$.pipe(take(1));

  constructor(private readonly _outletInstance: DialogOutletComponent) {}

  public close(result?: any) {
    this._outletInstance.dialog.close(result);
  }

  public getConfig() {
    return this._outletInstance.config();
  }

  public updateConfig(update: (config: DialogConfig) => DialogConfig) {
    const config = this._outletInstance.config() ?? {};
    const updatedConfig = update(config as DialogConfig);
    this._outletInstance.updateConfig(updatedConfig);
  }
}
