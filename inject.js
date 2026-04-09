(function () {
    // ================= XHR INTERCEPT =================
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
        this._url = url;
        return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function (body) {
        this.addEventListener("load", function () {
            try {
                window.postMessage({
                    type: "HINT_DATA",
                    payload: {
                        url: this._url,
                        status: this.status,
                        response: this.responseText,
                        source: "XHR"
                    }
                }, "*");
            } catch (e) {
                console.log("XHR intercept error", e);
            }
        });

        return originalSend.apply(this, arguments);
    };

    // ================= FETCH INTERCEPT =================
    const originalFetch = window.fetch;

    window.fetch = async function (...args) {
        const response = await originalFetch.apply(this, args);

        try {
            const cloned = response.clone();
            const text = await cloned.text();

            window.postMessage({
                type: "HINT_DATA",
                payload: {
                    url: args[0],
                    status: response.status,
                    response: text,
                    source: "FETCH"
                }
            }, "*");

        } catch (e) {
            console.log("Fetch intercept error", e);
        }

        return response;
    };
})();