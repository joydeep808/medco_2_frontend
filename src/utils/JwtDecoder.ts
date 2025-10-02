export function decodeJwtPayload(token: string) {
  const payloadB64 = token.split(".")[1];


  function base64UrlDecode(str: string) {

    let base64 = str.replace(/-/g, "+").replace(/_/g, "/");

    while (base64.length % 4) {
      base64 += "=";
    }

    const decoded = decodeURIComponent(
      atobPolyfill(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return decoded;
  }


  function atobPolyfill(input: string) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let str = "";
    let buffer = 0;
    let bits = 0;

    for (let i = 0; i < input.length; i++) {
      const c = input.charAt(i);
      if (c === "=") break;
      const val = chars.indexOf(c);
      if (val === -1) continue;

      buffer = (buffer << 6) | val;
      bits += 6;

      if (bits >= 8) {
        bits -= 8;
        str += String.fromCharCode((buffer >> bits) & 0xff);
      }
    }

    return str;
  }

  return JSON.parse(base64UrlDecode(payloadB64));
}

