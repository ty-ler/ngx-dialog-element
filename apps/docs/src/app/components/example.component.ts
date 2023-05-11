import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'docs-example',
  standalone: true,
  template: ``,
})
export class ExampleComponent {
  @HostBinding('class') _classes = 'tw-flex tw-flex-col';
}
