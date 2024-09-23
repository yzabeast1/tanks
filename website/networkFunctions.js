function fetchWithFallback(url,headers) {

    return fetch(url, { headers })
        .then(response => {
            if (!response.ok) throw new Error('HTTPS failed');
            return response.json();
        })
        .catch(error => {
            console.warn('HTTPS failed, falling back to HTTP:', error);
            // Retry with HTTP if HTTPS fails
            return fetch(url.replace('https://', 'http://'), { headers })
                .then(response => {
                    if (!response.ok) throw new Error('HTTP failed');
                    return response.json();
                });
        });
}

function postWithFallback(url, headers) {

    // Try sending the message using HTTPS
    fetch(url, {
        method: 'POST',
        headers: headers
    })
        .then(response => {
            if (!response.ok) throw new Error('HTTPS failed'); // Handle HTTP errors
            return response.json();
        })
        .catch(error => {
            console.warn('HTTPS failed, falling back to HTTP:', error);
            // Retry with HTTP if HTTPS fails
            fetch(url.replace('https://', 'http://'), {
                method: 'POST',
                headers: headers
            })
                .then(response => {
                    if (!response.ok) throw new Error('HTTP failed');
                    return response.json();
                })
                .catch(httpError => {
                    console.error('Both HTTPS and HTTP failed:', httpError);
                });
        });
}
function postWithFallbackNoJSON(url, headers) {

    // Try sending the message using HTTPS
    fetch(url, {
        method: 'POST',
        headers: headers
    })
        .then(response => {
            if (!response.ok) throw new Error('HTTPS failed'); // Handle HTTP errors
            return response;
        })
        .catch(error => {
            console.warn('HTTPS failed, falling back to HTTP:', error);
            // Retry with HTTP if HTTPS fails
            fetch(url.replace('https://', 'http://'), {
                method: 'POST',
                headers: headers
            })
                .then(response => {
                    if (!response.ok) throw new Error('HTTP failed');
                    return response;
                })
                .catch(httpError => {
                    console.error('Both HTTPS and HTTP failed:', httpError);
                });
        });
}