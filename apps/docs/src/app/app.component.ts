import { Component, HostBinding } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components';
import { ButtonComponent } from './components/button.component';
import { SidebarComponent } from './components/sidebar.component';
import { StackBlitzExampleComponent } from './examples/stackblitz-example.component';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    HeaderComponent,
    SidebarComponent,
    ButtonComponent,
    StackBlitzExampleComponent,
  ],
  selector: 'docs-root',
  template: `
    <!-- <docs-header></docs-header> -->
    <!-- <router-outlet></router-outlet> -->
    <div class="tw-flex">
      <docs-sidebar></docs-sidebar>
      <div id="simple" class="tw-p-6">
        <docs-stackblitz-example></docs-stackblitz-example>
        <button>Open</button>
      </div>
    </div>
  `,
})
export class AppComponent {
  @HostBinding('class') _classes = 'tw-flex tw-flex-col';
}
