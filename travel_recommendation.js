/*
// Helper: Get local time string for a given IANA timezone
function getLocalTime(timeZone) {
    if (!timeZone) return "";
    const options = { timeZone, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return new Date().toLocaleTimeString('en-US', options);
}

// Keyword matcher with singular/plural & partial match support
function matchesKeyword(input, keyword) {
    if (!input || !keyword) return false;

    const inputLower = input.toLowerCase().trim();
    const keywordLower = keyword.toLowerCase().trim();

    // Handle basic plural form conversions
    const pluralForm = keywordLower.endsWith('y')
        ? keywordLower.slice(0, -1) + 'ies'
        : keywordLower + 's';

    // Check for exact or plural match
    if (inputLower === keywordLower || inputLower === pluralForm) return true;

    // Check for substring match (flexible search)
    return inputLower.includes(keywordLower) || inputLower.includes(pluralForm);
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
                        <div class="result-card">
                            <img src="${beach.imageUrl}" alt="${beach.name}" class="result-image">
                            <div class="result-content">
                                <h3>${beach.name}</h3>
                                <p>${beach.description}</p>
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
                        <div class="result-card">
                            <img src="${temple.imageUrl}" alt="${temple.name}" class="result-image">
                            <div class="result-content">
                                <h3>${temple.name}</h3>
                                <p>${temple.description}</p>
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
                        <div class="result-card">
                            <img src="${city.imageUrl}" alt="${city.name}" class="result-image">
                            <div class="result-content">
                                <h3>${city.name}</h3>
                                <p>${city.description}</p>
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
                        <div class="result-card">
                            <img src="${city.imageUrl}" alt="${city.name}" class="result-image">
                            <div class="result-content">
                                <h3>${city.name}</h3>
                                <p>${city.description}</p>
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
                        <div class="result-card">
                            <img src="${city.imageUrl}" alt="${city.name}" class="result-image">
                            <div class="result-content">
                                <h3>${city.name}</h3>
                                <p>${city.description}</p>
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
                        <div class="result-card">
                            <img src="${temple.imageUrl}" alt="${temple.name}" class="result-image">
                            <div class="result-content">
                                <h3>${temple.name}</h3>
                                <p>${temple.description}</p>
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
                        <div class="result-card">
                            <img src="${beach.imageUrl}" alt="${beach.name}" class="result-image">
                            <div class="result-content">
                                <h3>${beach.name}</h3>
                                <p>${beach.description}</p>
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
*/
// Helper: Get local time string for a given IANA timezone
const headerHTML = `<div class="teal-header">Explore Travel Recommendations</div>`;

function getLocalTime(timeZone) {
    if (!timeZone) return "";
    const options = {
        timeZone,
        hour12: true,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };
    return new Date().toLocaleTimeString('en-US', options);
}

// Helper: Generate plural forms for matching
function getPluralForm(word) {
    if (!word) return "";

    const lower = word.toLowerCase().trim();

    if (lower.endsWith('y') && !/[aeiou]y$/.test(lower)) {
        return lower.slice(0, -1) + 'ies';
    }

    if (/(ch|sh|x|s|z)$/.test(lower)) {
        return lower + 'es';
    }

    return lower + 's';
}

// Flexible keyword matcher with plural and substring support
function matchesKeyword(input, keyword) {
    if (!input || !keyword) return false;

    const inputLower = input.toLowerCase().trim();
    const keywordLower = keyword.toLowerCase().trim();

    const inputPlural = getPluralForm(inputLower);
    const keywordPlural = getPluralForm(keywordLower);

    return (
        inputLower === keywordLower ||
        inputLower === keywordPlural ||
        inputPlural === keywordLower ||
        inputPlural === keywordPlural ||
        inputLower.includes(keywordLower) ||
        inputLower.includes(keywordPlural) ||
        inputPlural.includes(keywordLower) ||
        inputPlural.includes(keywordPlural)
    );
}

// Build card element HTML
function buildCard(item) {
    const timeString = item.timeZone ? `<p><b>Local Time:</b> ${getLocalTime(item.timeZone)}</p>` : "";
    return `
        <div class="result-card">
            <img src="${item.imageUrl}" alt="${item.name}" class="result-image">
            <div class="result-content">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                ${timeString}
                <button type="button" id="visit-btn">Visit</button>
            </div>
        </div>
    `;
}

// Search function with deduplication
function searchKeyword() {
    const userInput = document.getElementById("userInput").value.trim().toLowerCase();
    const searchResult = document.getElementById("search-result");
    searchResult.innerHTML = "";

    fetch("travel_recommendation.json")
        .then(response => response.json())
        .then(data => {
            let results = [];
            let addedKeys = new Set();

            function pushUnique(item) {
                const key = `${item.name}-${item.description}`;
                if (!addedKeys.has(key)) {
                    addedKeys.add(key);
                    results.push(buildCard(item));
                }
            }

            if (matchesKeyword(userInput, "beach")) {
                data.beaches.slice(0, 2).forEach(pushUnique);
            } else if (matchesKeyword(userInput, "temple")) {
                data.temples.slice(0, 2).forEach(pushUnique);
            } else if (matchesKeyword(userInput, "country")) {
                data.countries.slice(0, 2).forEach(country => {
                    if (country.cities.length > 0) {
                        pushUnique(country.cities[0]);
                    }
                });
            } else {
                data.countries.forEach(country => {
                    if (country.name?.toLowerCase().includes(userInput) && country.cities.length > 0) {
                        pushUnique(country.cities[0]);
                    }

                    country.cities.forEach(city => {
                        if (
                            city.name.toLowerCase().includes(userInput) ||
                            city.description.toLowerCase().includes(userInput)
                        ) {
                            pushUnique(city);
                        }
                    });
                });

                data.temples.forEach(temple => {
                    if (
                        temple.name.toLowerCase().includes(userInput) ||
                        temple.description.toLowerCase().includes(userInput)
                    ) {
                        pushUnique(temple);
                    }
                });

                data.beaches.forEach(beach => {
                    if (
                        beach.name.toLowerCase().includes(userInput) ||
                        beach.description.toLowerCase().includes(userInput)
                    ) {
                        pushUnique(beach);
                    }
                });
            }

            if (results.length > 0) {
                const headerHTML = `<div class="teal-header">.</div>`;
                searchResult.innerHTML = headerHTML + results.join("");
            }
            else {
                searchResult.innerHTML = "No results found.";
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