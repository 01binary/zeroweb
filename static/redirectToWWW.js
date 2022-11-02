var hostname = window.location.hostname;
var isLocalhost = hostname.indexOf('localhost') >= 0;
var isApex = hostname.indexOf('www') >= 0;

if (!isLocalhost && !isApex) {
  window.location.replace('https://www.01binary.us' + location.pathname);
}
