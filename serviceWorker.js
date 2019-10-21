const CACHE_VERSION = 1;
const CACHE_NAME = `caret-cache-v${CACHE_VERSION}`;

self.addEventListener('install', e => {
    e.waitUntil(async () => {
        await caches.open(CACHE_NAME);
    });
});

const getResponder = async (e) => {
    const cachePromise = caches.match(e.request);
    const fetchPromise = fetch(e.request);

    // Gets a promise returning a clone of the fetch request.
    const getFetchResponseClone = () => fetchPromise.then(r => r.clone());

    const update = async () => {
        const responseToCache = await getFetchResponseClone();

        // Store a copy of the response in the cache, if it was ok.
        if (responseToCache.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(e.request, responseToCache);
        }
    };

    // Always update whatever it is we tried to fetch.
    e.waitUntil(update());

    const responseToReturn = getFetchResponseClone();
    // If the cache doesn't have the request, try and fetch it from the network.
    const cachedOrNetwork = cachePromise
        .then(response => response || responseToReturn)
        .catch(() => responseToReturn);

    // If the network encounters an error, try and return a cached response.
    const networkOrCache = responseToReturn
        .catch(() => cachePromise);

    // Promise.race throws an error if either promise rejects, so be careful
    // that neither promise can throw.
    return Promise.race([cachedOrNetwork, networkOrCache]);
}

self.addEventListener('fetch', e => {
    e.respondWith(getResponder(e));
});