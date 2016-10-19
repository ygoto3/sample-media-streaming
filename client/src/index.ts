import { Dash } from "./utils/dash";
import { WebM } from "./utils/webm";

const swfobject = require("swfobject") as swfobject.SwfObject;
const styles = require("./index.css");

const ApiURL = "/* @echo API_URL */";

new Dash(
  "video",
  `${ApiURL}/media/big_buck_bunny.mpd`
);
// new WebM(
//   "video",
//   `${ApiURL}/media/big_buck_bunny.mp4.webm`
// );

// swfobject.embedSWF("./Player.swf", "video", "300", "240", "10");
