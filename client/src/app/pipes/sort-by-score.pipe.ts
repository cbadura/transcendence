import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortByScore'
})
export class SortByScorePipe implements PipeTransform {

  transform(value: any[]): any[] {
    return value.sort((n1, n2) => {
      return n2.level - n1.level; 
    });
  }
}
