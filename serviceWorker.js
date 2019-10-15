const CACHE_VERSION = 1;
const CACHE_NAME = `caret-cache-v${CACHE_VERSION}`;

self.addEventListener('install', e => {
    e.waitUntil(async () => {
        await caches.open(CACHE_NAME);
    });
});

const getResponder = async (e) => {
    const cachedPromise = caches.match(e.request);
    const updatePromise = (async () => {
        const newResponse = await fetch(e.request);

        // Store a copy of the response in the cache, if it was ok.
        if (newResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(e.request, newResponse.clone());
        }

        return newResponse;
    })();

    // Always update whatever it is we tried to fetch.
    e.waitUntil(updatePromise);

    // Get whichever one resolved first.
    let response = await Promise.race([cachedPromise, updatePromise]);

    // If the promise wasn't in the cache, fetch from the network.
    if (!response)
      response = await updatePromise;
    // Otherwise, if the network response wasn't okay, try serving from the cache.
    else if (!response.ok)
        response = await cachedPromise;

    return response;
}

self.addEventListener('fetch', e => {
    e.respondWith(getResponder(e));
});