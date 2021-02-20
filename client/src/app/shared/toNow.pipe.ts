import { Pipe, PipeTransform } from '@angular/core';
import * as dayjs from 'dayjs';
import * as relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

dayjs.locale('vi'); // use locale globally
dayjs.extend(relativeTime);

@Pipe({
  name: 'toNow',
})
export class ToNowPipe implements PipeTransform {

  transform(value: any): any {
    return dayjs().to(dayjs(value))  ;
  }

}
