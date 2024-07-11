// highlight.directive.ts
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true,
})
export class HighlightDirective {
  @Input() highlightColor: string = 'yellow';
  @Input() highlightScale: string = '1.1';

  constructor(private el: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.highlightColor, this.highlightScale);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight('', '1');
  }

  private highlight(color: string, scale: string) {
    this.el.nativeElement.style.backgroundColor = color;
    this.el.nativeElement.style.transform = `scale(${scale})`;
    this.el.nativeElement.style.transition = 'transform 0.3s, background-color 0.3s';
  }
}