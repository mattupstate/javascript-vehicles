var Utils = {
  randomColor: function () {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
  },
  RGBtoHex: function(r,g,b) {
    return this.toHex(r)+this.toHex(g)+this.toHex(b);
  },
  toHex: function toHex(n) {
    if (n==null) return "00";
    n=parseInt(n); if (n==0 || isNaN(n)) return "00";
    n=Math.max(0,n); n=Math.min(n,255); n=Math.round(n);
    return "0123456789ABCDEF".charAt((n-n%16)/16)
    + "0123456789ABCDEF".charAt(n%16);
  }
};