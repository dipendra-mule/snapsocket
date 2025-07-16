import { WSAdapter } from "./wsAdapter.js";
import { SocketIOAdapter } from "./socketioAdapter.js";

export function getAdapter(type = "ws") {
  return type === "socketio" ? SocketIOAdapter : WSAdapter;
}
