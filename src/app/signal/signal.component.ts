import { Component, HostBinding, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signal',
  standalone: true,
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
