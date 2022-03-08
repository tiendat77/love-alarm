import { Directive, ElementRef, HostListener, Input, NgZone, Renderer2 } from '@angular/core';
import { AnimationBuilder, style, animate } from '@angular/animations';

@Directive({
  selector: '[ripple]'
})
export class RippleDirective {

  @Input('ripple')
  public rippleColor: string;

  @Input('rippleDuration')
  public rippleDuration = 600;

  @Input('rippleCentered')
  public centered = true;

  protected get nativeElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  private rippleElementClass = 'ripple-inner';
  private rippleHostClass = 'ripple-host';
  private animationQueue = [];

  constructor(
    protected builder: AnimationBuilder,
    protected elementRef: ElementRef,
    protected renderer: Renderer2,
    private zone: NgZone
  ) { }

  @HostListener('mousedown', ['$event'])
  public onMouseDown(event) {
    this.zone.runOutsideAngular(() => this._ripple(event));
  }

  private setStyles(rippleElement: HTMLElement, styleParams: any) {
    this.renderer.addClass(rippleElement, this.rippleElementClass);
    this.renderer.setStyle(rippleElement, 'width', `${styleParams.radius}px`);
    this.renderer.setStyle(rippleElement, 'height', `${styleParams.radius}px`);
    this.renderer.setStyle(rippleElement, 'top', `${styleParams.top}px`);
    this.renderer.setStyle(rippleElement, 'left', `${styleParams.left}px`);

    if (this.rippleColor) {
      this.renderer.setStyle(rippleElement, 'background', this.rippleColor);
    }
  }

  private _ripple(event) {
    const target = this.nativeElement;

    const rectBounds = target.getBoundingClientRect();
    const radius = Math.max(rectBounds.width, rectBounds.height);
    let left = Math.round(event.clientX - rectBounds.left - radius / 2);
    let top = Math.round(event.clientY - rectBounds.top - radius / 2);

    if (this.centered) {
      left = top = 0;
    }

    const dimensions = {
      radius,
      top,
      left
    };

    const rippleElement = this.renderer.createElement('span');

    this.setStyles(rippleElement, dimensions);
    this.renderer.addClass(target, this.rippleHostClass);
    this.renderer.appendChild(target, rippleElement);

    const animation = this.builder.build([
      style({ opacity: 0.5, transform: 'scale(.3)' }),
      animate(this.rippleDuration, style({ opacity: 0, transform: 'scale(2)' }))
    ]).create(rippleElement);

    this.animationQueue.push(animation);

    animation.onDone(() => {
      this.animationQueue.splice(this.animationQueue.indexOf(animation), 1);
      target.removeChild(rippleElement);
      if (this.animationQueue.length < 1) {
        this.renderer.removeClass(target, this.rippleHostClass);
      }
    });

    animation.play();
  }
}
