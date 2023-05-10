import { Observable, take } from 'rxjs';
import { DialogComponentConfig, DialogConfig } from './dialog-config';
import { DialogOutletComponent } from './dialog-outlet.component';
import { DialogComponent } from './dialog.component';

export class DialogRef<TDialogResult> {
  public readonly closed$: Observable<TDialogResult> = this._dialog.closed.pipe(
    take(1)
  );
  public readonly backdropClicked$ =
    this._dialog.backdropClicked.asObservable();

  constructor(
    private readonly _outlet: DialogOutletComponent,
    private readonly _dialog: DialogComponent,
    private readonly _dialogIndex: number
  ) {}

  public close(result?: any) {
    this._dialog.close(result);
  }

  public getConfig() {
    return this._outlet.getConfig(this._dialogIndex) as DialogComponentConfig &
      DialogConfig;
  }

  public updateConfig(update: (config: DialogConfig) => DialogConfig) {
    this._outlet.updateConfig(this._dialogIndex, update);
  }
}
