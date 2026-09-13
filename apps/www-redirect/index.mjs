export default {
  fetch(request) {
    const incoming = new URL(request.url);
    const target = new URL("https://geteverlittle.com");
    target.pathname = incoming.pathname;
    target.search = incoming.search;
    return Response.redirect(target.toString(), 308);
  },
};
