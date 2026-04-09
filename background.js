chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "ASK_AI") {

        console.log("API HIT 🚀");

        fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyARkP2ZNTnJXI1c0u90L2Jzsp7g6GYEnh0", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: request.prompt }]
                    }
                ]
            })
        })
        .then(res => {
            console.log("RAW RESPONSE:", res);
            return res.json();
        })
        .then(data => {
            console.log("FULL RESPONSE:", data);

            if (data.error) {
                sendResponse("API ERROR: " + data.error.message);
                return;
            }

            let text = "No response";

            if (data.candidates?.length) {
                const parts = data.candidates[0]?.content?.parts;
                if (parts?.length) {
                    text = parts.map(p => p.text || "").join("");
                }
            }

            sendResponse(text);
        })
        .catch(err => {
            console.error("FETCH ERROR:", err);
            sendResponse("Network Error");
        });

        return true;
    }
});