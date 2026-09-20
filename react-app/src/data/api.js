import { repositories, scans, findings } from "./mockScanResults.js";

// Fake API: returns mock data after a short delay, like a real server would.
// Add ?error=1 to any page URL to see the error state.
function fakeRequest(getData) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (window.location.search.includes("error=1")) {
        reject(new Error("Could not load data from the server."));
      } else {
        resolve(getData());
      }
    }, 500);
  });
}

export function getRepositories() {
  return fakeRequest(() => ({ repositories, scans }));
}

export function getScanData() {
  return fakeRequest(() => ({ repositories, scans, findings }));
}
