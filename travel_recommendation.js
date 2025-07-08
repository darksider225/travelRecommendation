// Helper: Get local time string for a given IANA timezone
function getLocalTime(timeZone) {
    if (!timeZone) return "";
    const options = { timeZone, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return new Date().toLocaleTimeString('en-US', options);
}

// Helper: Singular/plural keyword match
function matchesKeyword(input, word) {
    const singular = word.toLowerCase();
    const plural = singular.endsWith('y')
        ? singular.slice(0, -1) + 'ies'
        : singular + 's';
    return (
        input === singular ||
        input === plural
    );
}

function searchKeyword() {
    const userInput = document.getElementById("userInput").value.trim().toLowerCase();
    const searchResult = document.getElementById("search-result");
    searchResult.innerHTML = ""; // Clear previous results

    fetch("travel_recommendation.json")
        .then(response => response.json())
        .then(data => {
            let results = [];

            // Show recommendations for "beach"/"beaches"
            if (matchesKeyword(userInput, "beach")) {
                data.beaches.slice(0, 2).forEach(beach => {
                    let timeString = beach.timeZone ? `<p><b>Local Time:</b> ${getLocalTime(beach.timeZone)}</p>` : "";
                    results.push(`
                        <div style="border:1px solid #ccc; border-radius:8px; margin-bottom:20px; background:#fff;">
                            <img src="${beach.imageUrl}" alt="${beach.name}" style="width:100%; max-width:400px; border-radius:8px 8px 0 0;">
                            <div style="padding:10px;">
                                <h3 style="margin:0 0 10px 0;">${beach.name}</h3>
                                <p style="margin:0;">${beach.description}</p>
                                ${timeString}
                            </div>
                        </div>
                    `);
                });
            }
            // Show recommendations for "temple"/"temples"
            else if (matchesKeyword(userInput, "temple")) {
                data.temples.slice(0, 2).forEach(temple => {
                    let timeString = temple.timeZone ? `<p><b>Local Time:</b> ${getLocalTime(temple.timeZone)}</p>` : "";
                    results.push(`
                        <div style="border:1px solid #ccc; border-radius:8px; margin-bottom:20px; background:#fff;">
                            <img src="${temple.imageUrl}" alt="${temple.name}" style="width:100%; max-width:400px; border-radius:8px 8px 0 0;">
                            <div style="padding:10px;">
                                <h3 style="margin:0 0 10px 0;">${temple.name}</h3>
                                <p style="margin:0;">${temple.description}</p>
                                ${timeString}
                            </div>
                        </div>
                    `);
                });
            }
            // Show recommendations for "country"/"countries"
            else if (matchesKeyword(userInput, "country")) {
                data.countries.slice(0, 2).forEach(country => {
                    // Show the country and its first city as a recommendation
                    let city = country.cities[0];
                    let timeString = city.timeZone ? `<p><b>Local Time:</b> ${getLocalTime(city.timeZone)}</p>` : "";
                    results.push(`
                        <div style="border:1px solid #ccc; border-radius:8px; margin-bottom:20px; background:#fff;">
                            <img src="${city.imageUrl}" alt="${city.name}" style="width:100%; max-width:400px; border-radius:8px 8px 0 0;">
                            <div style="padding:10px;">
                                <h3 style="margin:0 0 10px 0;">${country.name} - ${city.name}</h3>
                                <p style="margin:0;">${city.description}</p>
                                ${timeString}
                            </div>
                        </div>
                    `);
                });
            }
            // Otherwise, search all fields for the keyword
            else {
                // Search countries and their cities
                data.countries.forEach(country => {
                    if (country.name && country.name.toLowerCase().includes(userInput)) {
                        let city = country.cities[0];
                        let timeString = city.timeZone ? `<p><b>Local Time:</b> ${getLocalTime(city.timeZone)}</p>` : "";
                        results.push(`
                            <div style="border:1px solid #ccc; border-radius:8px; margin-bottom:20px; background:#fff;">
                                <img src="${city.imageUrl}" alt="${city.name}" style="width:100%; max-width:400px; border-radius:8px 8px 0 0;">
                                <div style="padding:10px;">
                                    <h3 style="margin:0 0 10px 0;">${country.name} - ${city.name}</h3>
                                    <p style="margin:0;">${city.description}</p>
                                    ${timeString}
                                </div>
                            </div>
                        `);
                    }
                    country.cities.forEach(city => {
                        if (
                            city.name.toLowerCase().includes(userInput) ||
                            city.description.toLowerCase().includes(userInput)
                        ) {
                            let timeString = city.timeZone ? `<p><b>Local Time:</b> ${getLocalTime(city.timeZone)}</p>` : "";
                            results.push(`
                                <div style="border:1px solid #ccc; border-radius:8px; margin-bottom:20px; background:#fff;">
                                    <img src="${city.imageUrl}" alt="${city.name}" style="width:100%; max-width:400px; border-radius:8px 8px 0 0;">
                                    <div style="padding:10px;">
                                        <h3 style="margin:0 0 10px 0;">${city.name}</h3>
                                        <p style="margin:0;">${city.description}</p>
                                        ${timeString}
                                    </div>
                                </div>
                            `);
                        }
                    });
                });

                // Search temples
                data.temples.forEach(temple => {
                    if (
                        temple.name.toLowerCase().includes(userInput) ||
                        temple.description.toLowerCase().includes(userInput)
                    ) {
                        let timeString = temple.timeZone ? `<p><b>Local Time:</b> ${getLocalTime(temple.timeZone)}</p>` : "";
                        results.push(`
                            <div style="border:1px solid #ccc; border-radius:8px; margin-bottom:20px; background:#fff;">
                                <img src="${temple.imageUrl}" alt="${temple.name}" style="width:100%; max-width:400px; border-radius:8px 8px 0 0;">
                                <div style="padding:10px;">
                                    <h3 style="margin:0 0 10px 0;">${temple.name}</h3>
                                    <p style="margin:0;">${temple.description}</p>
                                    ${timeString}
                                </div>
                            </div>
                        `);
                    }
                });

                // Search beaches
                data.beaches.forEach(beach => {
                    if (
                        beach.name.toLowerCase().includes(userInput) ||
                        beach.description.toLowerCase().includes(userInput)
                    ) {
                        let timeString = beach.timeZone ? `<p><b>Local Time:</b> ${getLocalTime(beach.timeZone)}</p>` : "";
                        results.push(`
                            <div style="border:1px solid #ccc; border-radius:8px; margin-bottom:20px; background:#fff;">
                                <img src="${beach.imageUrl}" alt="${beach.name}" style="width:100%; max-width:400px; border-radius:8px 8px 0 0;">
                                <div style="padding:10px;">
                                    <h3 style="margin:0 0 10px 0;">${beach.name}</h3>
                                    <p style="margin:0;">${beach.description}</p>
                                    ${timeString}
                                </div>
                            </div>
                        `);
                    }
                });
            }

            if (results.length === 0) {
                searchResult.innerHTML = "No results found.";
            } else {
                searchResult.innerHTML = results.join("");
            }
        })
        .catch(error => {
            searchResult.innerHTML = "Error loading data.";
            console.error(error);
        });
}

// Clear button logic
function clearResults() {
    document.getElementById("userInput").value = "";
    document.getElementById("search-result").innerHTML = "";
}

// Event listeners
document.getElementById("search-btn").addEventListener("click", searchKeyword);
document.getElementById("clear-btn").addEventListener("click", clearResults);