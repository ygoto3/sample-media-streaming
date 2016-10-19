package {

  import flash.display.Sprite;
  import flash.display.StageScaleMode;
  import flash.display.StageAlign;
  import flash.events.Event;
  import flash.events.NetStatusEvent;
  import flash.net.NetConnection;
  import flash.net.NetStream;
  import flash.media.Video;
  import flash.external.ExternalInterface;

  [SWF(backgroundColor="0x000000")]
  public class Player extends Sprite {

    private var nc: NetConnection;
    private var ns: NetStream;
    private var video: Video;

    function Player() {
      setupStage();
      setupNetConnection();
      setupVideo();

      connect("rtmp://localhost:1935/live");
      // connect("rtmp://104.199.132.34:1935/live_1080p");
    }

    private function connect(url: String): void {
      nc.connect(url);
    }

    private function play(stream: String): void {
      ns.play(stream);
    }

    private function setupStage(): void {
      stage.scaleMode = StageScaleMode.NO_SCALE;
      stage.align = StageAlign.TOP_LEFT;
    }

    private function setupNetConnection(): void {
      nc = new NetConnection();
      nc.addEventListener(NetStatusEvent.NET_STATUS, onChangeNCStatus);
    }

    private function setupNetStream(): void {
      ns = new NetStream(nc);
      ns.addEventListener(NetStatusEvent.NET_STATUS, onChangeNSStatus);

      video.attachNetStream(ns);
    }

    private function setupVideo(): void {
      video = new Video(stage.width, stage.height);
      addChild(video);
    }

    private function onChangeNCStatus(e: NetStatusEvent): void {
      const code: String = e.info.code;
      log(code);
      switch (code) {
        case "NetConnection.Connect.Success":
          setupNetStream();
          play("test");
          break;
      }
    }

    private function onChangeNSStatus(e: NetStatusEvent): void {
      const code: String = e.info.code;
      log(code);
    }

    private function log(...args): void {
      if (!ExternalInterface.available) return;

      var script: String = <![CDATA[
        function (mes) {
          window.console.log(mes);
        }
      ]]>;
      script.replace(/\r?\n|\r/g, "");
      ExternalInterface.call( script, args.join(" ") );
    }

  }

}
