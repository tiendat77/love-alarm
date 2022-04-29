import { Component, Input } from '@angular/core';

@Component({
  selector: 'la-gender',
  templateUrl: './gender.component.html',
  styleUrls: ['./gender.component.scss'],
})
export class GenderComponent {

  @Input() value: string;

}