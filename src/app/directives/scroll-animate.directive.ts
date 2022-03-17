import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[scroll-animate], scroll-animate',
  host: {}
})
export class ScrollAnimateDirective {

  get element() {
    return this.elementRef.nativeElement as HTMLElement;
  }

  get headerTitle() {
    return this.element.getElementsByClassName('page-title')[0] as HTMLElement;
  }

  get contentTitle() {
    return this.element.getElementsByClassName('page-content-title')[0] as HTMLElement;
  }

  constructor(
    private elementRef: ElementRef
  ) { }

  ngAfterViewInit() {
    try {
      this.headerTitle.style.display = 'none';
    } catch (e) { }
  }

  @HostListener('scroll', ['$event'])
  onScroll(event) {
    this.element.scrollTop > 54
      ? this.headerTitle.style.display = 'block'
      : this.headerTitle.style.display = 'none';
  }
}