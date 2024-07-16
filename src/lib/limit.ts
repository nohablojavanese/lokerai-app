let lastRequestTime = 0;
let remainingRequests = 5; // Maximum 10 requests per hour

export const MAX_REQUESTS_PER_HOUR = 5;
export const REQUEST_INTERVAL = 3600000 / MAX_REQUESTS_PER_HOUR; // Interval in milliseconds (3600000 ms = 1 hour);

export function canMakeRequest() {
  const now = Date.now();

  if (now - lastRequestTime < REQUEST_INTERVAL) {
    return false;
  }

  if (now - lastRequestTime > 3600000) {
    remainingRequests = MAX_REQUESTS_PER_HOUR;
  }

  return true;
}

export function updateRequestTime() {
  lastRequestTime = Date.now();
  remainingRequests--;
}
