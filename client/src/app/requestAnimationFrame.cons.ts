import { environment } from './../environments/environment';

let RequestAnimationFrame = (callback, time = 0) => {
    if (environment.isRunningInNode) {
        setTimeout(callback, time)
    } else {
        setTimeout(() => {
            requestAnimationFrame(callback);
        }, time)
    }


};
export default RequestAnimationFrame;


