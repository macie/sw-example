if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('cache.js')
    .then(function(reg) {
        if(reg.installing) {
            console.log('Cache installing...');
        } else if(reg.waiting) {
            console.log('Cache installed');
        } else if(reg.active) {
            console.log('Cache active!');
        }
    }).catch(function(error) {
        // registration failed
        console.log('Cache registration failed with ' + error);
    });

    window.update = function(list) {
        window.todos = list;
        caches.open('todo')
            .then(function(cache) {
                cache.addAll(
                    window.todos.map(function(id) {
                        return 'item'+id+'.html';
                    })
                );
            });
    };

    window.clearCache = function(number) {
        caches.open('todo')
            .then(function(cache) {
                cache.keys().then(function(keys) {
                    keys.forEach(function(request) {
                        if (!request.url.includes('cache-empty.html')) {
                            cache.delete(request);
                        }
                    });
                });
            });
    }
}