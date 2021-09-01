const ROUTE_CHANGE_EVENT_NAME = 'route-change';

export const dispatchRouteEvent = nextUrl => {
  window.dispatchEvent(
    new CustomEvent(ROUTE_CHANGE_EVENT_NAME, { detail: { nextUrl } })
  );
};

export const catchRouteEvent = onRoute => {
  window.addEventListener(ROUTE_CHANGE_EVENT_NAME, e => {
    const { nextUrl } = e.detail;

    if (!nextUrl) return;

    history.pushState(null, null, nextUrl);
    onRoute();
  });
};
