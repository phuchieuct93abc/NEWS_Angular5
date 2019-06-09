let RequestAnimationFrame = (callback) => {
    if (requestAnimationFrame !== undefined) {
        requestAnimationFrame(callback)
    } else {
        setTimeout(callback)
    }


}
export default RequestAnimationFrame;


