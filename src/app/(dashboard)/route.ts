export function GET(req: Request) {
  // const url = new URL("/dms", req.url);
  const url = new URL("/home", req.url);
  return Response.redirect(url);
}
