export default class ArticleContentParser {
    video: HTMLVideoElement;
    source: HTMLSourceElement;

    constructor(private videoBody: Element) {

        this.video = <HTMLVideoElement>videoBody.firstElementChild;
        this.source = <HTMLSourceElement>this.video.firstElementChild
    }

    public parse() {
        this.updateVideoAttributes();
        this.appendOpenVideo();
        this.source.remove();
    }

    private appendOpenVideo() {
        let openVideo: HTMLDivElement = document.createElement('div');
        openVideo.classList.add('text-right');

        let openVideoLink: HTMLAnchorElement = <HTMLAnchorElement>(document.createElement('a'));
        openVideoLink.textContent = 'Mở video';
        openVideoLink.setAttribute('href', this.source.getAttribute('src'));
        openVideoLink.setAttribute('target', '_blank');
        openVideoLink.setAttribute('rel', 'noreferrer');

        openVideoLink.classList.add('mat-button', 'mat-primary');

        openVideo.append(openVideoLink)
        this.videoBody.append(openVideo);
    }

    private updateVideoAttributes() {
        this.video.setAttribute('controls', 'true');
        this.video.setAttribute('data-html5-video', 'true')
        this.video.setAttribute('playsinline', 'true')
    }

    private updateVideoSrc(video: HTMLVideoElement) {
        // let header = new HttpHeaders({
        //     'Referer': "http://a.a",
        //     'tinh': 'te'
        // })
        // this.httpClient.get(video.firstElementChild.getAttribute('src'), {
        //     headers: header
        // }).subscribe(value => {
        //     console.log('value', value)
        // }, value => {
        //     video.setAttribute('src', value.url);
        //
        // })
    }
}