import { Directive, ElementRef, Input, Renderer2, OnInit, HostListener } from '@angular/core';

@Directive({
  selector: '[appAnimatedBorder]',
  standalone: true,
})
export class AnimatedBorderDirective implements OnInit {
  @Input() borderColor: string = 'blue';
  private animatedBorder: any;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.setStyle();
  }

  @HostListener('mouseenter') onMouseEnter() {
    console.log('a');
    this.addAnimatedBorder();
  }

  @HostListener('mouseleave') onMouseLeave() {
    console.log('a');
    this.removeAnimatedBorder();
  }

  private setStyle() {
    const element = this.el.nativeElement;
    this.renderer.setStyle(element, 'position', 'relative');
    this.renderer.setStyle(element, 'border', '2px solid black');
    this.renderer.setStyle(element, 'padding', '10px');
  }

  private addAnimatedBorder() {
    const element = this.el.nativeElement;

    if (!this.animatedBorder) {
      this.animatedBorder = this.renderer.createElement('div');
      this.renderer.setStyle(this.animatedBorder, 'position', 'absolute');
      this.renderer.setStyle(this.animatedBorder, 'top', '0');
      this.renderer.setStyle(this.animatedBorder, 'left', '0');
      this.renderer.setStyle(this.animatedBorder, 'width', '100%');
      this.renderer.setStyle(this.animatedBorder, 'height', '100%');
      this.renderer.setStyle(this.animatedBorder, 'border', `2px solid ${this.borderColor}`);
      this.renderer.setStyle(this.animatedBorder, 'border-radius', '10px');
      this.renderer.setStyle(this.animatedBorder, 'box-sizing', 'border-box');
      this.renderer.setStyle(this.animatedBorder, 'animation', 'borderAnimation 2s linear infinite');
    }

    this.renderer.appendChild(element, this.animatedBorder);
  }

  private removeAnimatedBorder() {
    if (this.animatedBorder) {
      this.renderer.removeChild(this.el.nativeElement, this.animatedBorder);
      this.animatedBorder = null;
    }
  }
}
