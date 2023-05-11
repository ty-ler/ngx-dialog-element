import { Component, HostBinding } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'docs-sidebar',
  standalone: true,
  imports: [RouterModule],
  styles: [
    `
      a {
        @apply tw-w-full tw-px-2 tw-py-1 tw-no-underline tw-transition tw-rounded;

        &:hover {
          @apply tw-bg-white/[.25];
        }
      }
    `,
  ],
  template: ` <a routerLink="/" fragment="simple">Simple</a> `,
})
export class SidebarComponent {
  @HostBinding('class') _classes =
    'tw-sticky tw-top-0 tw-flex tw-flex-col tw-h-[100dvh] tw-bg-gray-900 tw-px-2 tw-py-6';
}
