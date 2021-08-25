import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[laAvatar], [la-avatar]',
  host: {
    'class': 'la-avatar',
    '[style.width]': 'size',
    '[style.height]': 'size',
    '(error)': 'onError($event)'
  }
})
export class AvatarDirective {

  @Input() name = '';
  @Input() size = '4rem';

  private colours = [
    '#1abc9c', '#2ecc71', '#3498db', '#9b59b6',
    '#34495e', '#16a085', '#27ae60', '#2980b9', '#8e44ad',
    '#2c3e50', '#f1c40f', '#e67e22', '#e74c3c', '#95a5a6',
    '#f39c12', '#d35400', '#c0392b', '#bdc3c7', '#7f8c8d'
  ];

  constructor(private elementRef: ElementRef) { }

  onError(event) {
    const img = this.elementRef.nativeElement as HTMLImageElement;
    img.src = this.generate();
  }

  private generate() {
    const name = this.getName();
    const color = this.getColor(name);

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = 256;
    canvas.height = 256;

    canvas.style.width = this.size;
    canvas.style.height = this.size;

    context.fillStyle = color;
    context.fillRect(0, 0, 256, 256);

    context.font = '128px Montserrat';
    context.textAlign = 'center';
    context.fillStyle = '#fff';
    context.fillText(name, 128, 170);

    return canvas.toDataURL();
  }

  private getName(name = this.name) {
    if (!name) {
      // Love Alarm
      return 'LA';
    }

    return name.split(' ', 2)
      .map(letters => letters[0])
      .join('')
      .toUpperCase();
  }

  private getColor(letter: string) {
    const charIndex = letter.charCodeAt(0) - 65;
    const colorIndex = charIndex % 19;
    return this.colours[colorIndex];
  }

}
