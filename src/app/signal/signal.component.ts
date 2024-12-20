import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';

@Component({
    selector: 'app-signal',
    imports: [CommonModule],
    templateUrl: './signal.component.html',
    styleUrls: ['./signal.component.scss']
})
export class SignalComponent {

  @Input()
  public signal: 1 | 0 | null = null;

  @HostBinding('class.on') 
  public get on(): boolean {
    return Boolean(this.signal);
  }
}
