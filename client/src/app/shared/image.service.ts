import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ImageSerice {

    private readonly max = 650;
    private readonly min = 150;

    public getImage(imagePath: string, size: number) {

        if (imagePath.indexOf('baomoi') > 0) {
            size = Math.min(Math.max(this.min, size), this.max);
            size = Math.ceil((size + 1) / 50) * 50;

            let result = imagePath;

            result = result.replace(new RegExp(/\/w(\d)*/gm), '/w' + size);
            const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
            if (isChrome) {
                result = result + '.webp';
            }
            return result;
        }

        return imagePath;
    }

}
