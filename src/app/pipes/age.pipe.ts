import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'age'
})
export class AgePipe implements PipeTransform {

  transform(value: string) {
    if (!value) {
      return '';
    }

    const today = moment();
    const birthdate = moment(value);
    const years = today.diff(birthdate, 'years');
    return years;
  }

}