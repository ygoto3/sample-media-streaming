interface ISize {
  length: number;
  offset: number;
}

export class WebM {

  id: string;

  video: HTMLVideoElement;

  webm: Uint8Array;

  mediaSource: MediaSource;

  sourceBuffer: SourceBuffer;

  ptr = 0;

  tags = {
    EBML: new Uint8Array([0x1a, 0x45, 0xdf, 0xa3]),
    Segment: new Uint8Array([0x18, 0x53, 0x80, 0x67]),
    Cluster: new Uint8Array([0x1f, 0x43, 0xb6, 0x75]),
    Void: new Uint8Array([0xec])
  };

  constructor(id: string, src: string) {

    this.id = id;
    this.getData(
      src,
      () => {
        this.initVideo(id);
      }
    );

  }

  getData(url: string, cb: () => void) {

    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "arraybuffer";
    xhr.onload = e => {
      this.webm = new Uint8Array((e.target as any).response);
      cb();
    }
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

    const sb = this.mediaSource.addSourceBuffer(`video/webm; codecs="vp8,vorbis"`);
    sb.addEventListener("updateend", this.appendMediaSegment.bind(this), false);
    this.sourceBuffer = sb;
    this.appendInitSegment();

  }

  appendInitSegment() {

    let size: ISize;

    if (
      !this.isEqual(
        this.tags.EBML,
        this.webm.subarray(this.ptr, this.ptr + this.tags.EBML.byteLength)
      )
    ) {
      console.log("WebM data error");
      return;
    }
    this.ptr += this.tags.EBML.byteLength;

    size = this.getElementSize(this.webm, this.ptr);
    this.ptr += size.offset + size.length;

    if (
      !this.isEqual(
        this.tags.Segment,
        this.webm.subarray(this.ptr, this.ptr + this.tags.Segment.byteLength)
      )
    ) {
      console.log("WebM data error");
      return;
    }
    this.ptr += this.tags.Segment.byteLength;

    size = this.getElementSize(this.webm, this.ptr);
    this.ptr += size.offset;

    while (
      !this.isEqual(
        this.tags.Cluster,
        this.webm.subarray(this.ptr, this.ptr + this.tags.Cluster.byteLength)
      )
    ) {

      if (
        this.isEqual(
          this.tags.Void,
          this.webm.subarray(this.ptr, this.ptr + this.tags.Void.byteLength)
        )
      ) {
        this.ptr += this.tags.Void.byteLength;
      } else {
        this.ptr += this.tags.Cluster.byteLength;
      }

      size = this.getElementSize(this.webm, this.ptr);
      this.ptr += size.offset + size.length;

    }

    const initSegment = new Uint8Array(this.webm.subarray(0, this.ptr));
    this.sourceBuffer.appendBuffer(initSegment.buffer);

  }

  appendMediaSegment() {

    const start = this.ptr;

    if (
      !this.isEqual(
        this.tags.Cluster,
        this.webm.subarray(this.ptr, this.ptr + this.tags.Cluster.byteLength)
      )
    ) return;

    this.ptr += this.tags.Cluster.byteLength;

    const size = this.getElementSize(this.webm, this.ptr);
    this.ptr += size.offset + size.length;

    const mediaSegment = new Uint8Array(this.webm.subarray(start, this.ptr));
    this.sourceBuffer.appendBuffer(mediaSegment.buffer);

  }

  isEqual(a: ArrayBufferView, b: ArrayBufferView): boolean {

    if (a.byteLength !== b.byteLength) return false;

    for (let i = 0, len = a.byteLength; i < len; i++) {
      if ((a as any)[i] !== (b as any)[i]) return false;
    }

    return true;

  }

  getElementSize(webm: ArrayBuffer, ptr: number): ISize {

    let length = 0;
    let n = (webm as any)[ptr] as number;
    let j: number;
    let offset = 0;

    for (let i = 0; i< 8; i++) {
      if ((n >> (7-i)) > 0) {
        j = i;
        break;
      }
    }

    for (let i = 0; i <= j; i++) {
      let b = (webm as any)[ptr + offset];
      if (i === 0) b -= (1 << 7-j);
      length = length * 256 + b;
      offset++;
    }

    return { length, offset };

  }

}
