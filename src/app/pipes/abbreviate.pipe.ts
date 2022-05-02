import { Pipe, PipeTransform } from '@angular/core';
import { abbreviate } from '../helpers/number.helper';

@Pipe({
  name: 'abbreviate'
})
export class AbbreviatePipe implements PipeTransform {

  transform(value: string | number): string {
    if (!value) {
      return '0';
    }

    return abbreviate(Number.parseInt(value as string, 10));
  }

}