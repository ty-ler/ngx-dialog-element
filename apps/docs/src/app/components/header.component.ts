import { CommonModule } from '@angular/common';
import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'docs-header',
  standalone: true,
  imports: [CommonModule],
  template: ``,
})
export class HeaderComponent {
  @HostBinding('class') _classes =
    'tw-flex tw-items-center tw-gap-2 tw-bg-gray-900';
}
