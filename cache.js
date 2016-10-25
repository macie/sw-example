function Cache() {
    self.addEventListener('install', this.static.bind(this));
    self.addEventListener('fetch', this.fetch.bind(this));
}

Cache.prototype.static = function(event) {
    event.waitUntil(
        caches.open('todo')
            .then(function(cache) {
                return cache.addAll([
                    'main.js',
                    'cache.js',
                    'cache-empty.html'
                ]);
            })
    );
};

Cache.prototype.fetch = function(event) {
    event.respondWith(
        caches.open('todo')
            .then(function(cache) {
                return fetch(event.request)
                    .then(function(response) {
                        // network is working => cache response
                        cache.put(event.request, response.clone());
                        return response;
                    })
                    .catch(function() {
                        // no network => search in cache or return default
                        return cache.match(event.request)
                            .then(function(cachedResponse) {
                                return cachedResponse || cache.match('cache-empty.html');
                            });
                    })
            })
    );
};

new Cache();