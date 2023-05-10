import { Injectable } from '@angular/core';

@Injectable()
export class DialogTestService {
  public helloWorld() {
    alert('hello world');
  }
}
