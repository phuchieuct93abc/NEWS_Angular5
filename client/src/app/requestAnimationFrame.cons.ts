import CONFIG from "../environments/environment";

let RequestAnimationFrame = (callback) => {
    if (CONFIG.isRunningInNode) {
        setTimeout(callback)
    } else {
        requestAnimationFrame(callback)
    }


}
export default RequestAnimationFrame;


