import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform<T>(value: T[], predicate: (value: T) => boolean): T[] {
    return value.filter((v) => predicate(v));
  }
}
