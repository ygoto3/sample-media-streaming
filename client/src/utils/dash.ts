export class Dash {

  id: string;

  mpd: any;

  mediaSource: MediaSource;

  sourceBuffer: SourceBuffer;

  index: number = 0;

  type: string;

  constructor(id: string, src: string) {

    this.id = id;
    this.getDescription(
      src,
      () => {
        this.initVideo(id);
      }
    );

  }

  getDescription(url: string, cb: () => void) {

    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "document";
    xhr.overrideMimeType("text/xml");
    xhr.onload = (e) => {
      const mpd = xhr.responseXML;
      const representation = mpd.getElementsByTagName("Representation")[0];
      const mimeType = representation.getAttribute("mimeType");
      const codecs = representation.getAttribute("codecs");
      this.type = `${mimeType}; codecs="${codecs}"`
      this.mpd = mpd;
      cb();
    };
    xhr.send(null);

  }

  initVideo(id: string) {

    const ms = new MediaSource();
    const video = document.getElementById(id) as HTMLVideoElement;

    ms.addEventListener("sourceopen", this.initSourceBuffer.bind(this), false);
    video.src = URL.createObjectURL(ms);

    this.mediaSource = ms;

  }

  initSourceBuffer() {

    const sb = this.mediaSource.addSourceBuffer(this.type);
    sb.addEventListener("updateend", this.appendMediaSegment.bind(this), false);
    this.sourceBuffer = sb;
    this.appendInitSegment();

  }

  appendSegment(e: Event) {

    const target = e.target as any;
    this.sourceBuffer.appendBuffer(target.response);

  }

  appendInitSegment() {

    const xhr = new XMLHttpRequest();
    const url = this.mpd.getElementsByTagName("Initialization")[0].getAttribute("sourceURL");
    xhr.open("GET", `http://localhost:8080/media/${url}`, true);
    xhr.responseType = "arraybuffer";
    xhr.onload = this.appendSegment.bind(this);
    xhr.send(null);

  }

  appendMediaSegment() {

    const xhr = new XMLHttpRequest();
    const url = this.mpd.getElementsByTagName("SegmentURL")[this.index++].getAttribute("media");
    xhr.open("GET", `http://localhost:8080/media/${url}`, true);
    xhr.responseType = "arraybuffer";
    xhr.onload = this.appendSegment.bind(this);
    xhr.send(null);

  }

}
