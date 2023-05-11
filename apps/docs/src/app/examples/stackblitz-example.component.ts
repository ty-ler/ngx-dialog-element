import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import stackBlitzSDK from '@stackblitz/sdk';

@Component({
  selector: 'docs-stackblitz-example',
  standalone: true,
  template: ` <div #exampleContainer></div> `,
})
export class StackBlitzExampleComponent implements OnInit {
  @ViewChild('exampleContainer', { static: true })
  exampleContainer!: ElementRef<HTMLDivElement>;

  ngOnInit() {
    const exampleContainer = this.exampleContainer.nativeElement;

    stackBlitzSDK.embedProjectId(exampleContainer, 'angular-kznqbx', {
      forceEmbedLayout: true,
      openFile: 'src/main.ts',
      view: 'preview',
      showSidebar: false,
      hideDevTools: true,
      hideExplorer: true,
      hideNavigation: true,
    });
  }
}
