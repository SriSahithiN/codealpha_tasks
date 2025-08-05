        // Fun facts data for demonstration
        const funFacts = {
            1990: "The Hubble Space Telescope was launched.",
            1991: "The World Wide Web became publicly available.",
            1992: "The first text message was sent.",
            1993: "Jurassic Park was released in theaters.",
            1994: "The first full-length animated film created with computer-generated imagery, 'Toy Story', was released.",
            1995: "Amazon.com sold its first book.",
            1996: "The first 'Tamagotchi' virtual pet was released.",
            1997: "The first Harry Potter book was published.",
            1998: "Google was founded by Larry Page and Sergey Brin.",
            1999: "The Euro was introduced as a new currency.",
            2000: "The Millennium Bug (Y2K) was successfully averted.",
            2001: "Wikipedia, a free encyclopedia, was launched.",
            2002: "The first iPod with a scroll wheel was released.",
            2003: "Space Shuttle Columbia disintegrated upon re-entry.",
            2004: "Facebook was launched by Mark Zuckerberg.",
            2005: "YouTube was founded.",
            2006: "Twitter was launched.",
            2007: "The first iPhone was released.",
            2008: "The Large Hadron Collider (LHC) was powered up.",
            2009: "Bitcoin, the first cryptocurrency, was created.",
            2010: "Instagram was launched.",
            2011: "The first fully solar-powered plane completed its maiden flight.",
            2012: "The Summer Olympics were held in London.",
            2013: "Pope Benedict XVI resigned, the first pope to do so since 1415.",
            2014: "The 'Ice Bucket Challenge' went viral.",
            2015: "NASA's New Horizons spacecraft flew past Pluto.",
            2016: "Pokémon Go was released, becoming a global phenomenon.",
            2017: "Artificial intelligence program AlphaGo defeated the world champion in the board game Go.",
            2018: "The first-ever successful cloning of a primate using the somatic cell nuclear transfer method was announced.",
            2019: "The first image of a black hole was captured and released by the Event Horizon Telescope collaboration.",
            2020: "COVID-19 was declared a global pandemic.",
            2021: "James Webb Space Telescope was launched.",
            2022: "The Artemis 1 mission was launched.",
            2023: "The first commercial flight to space by Virgin Galactic took place.",
            2024: "The first successful human brain-chip implant was performed by Neuralink."
        };

        const zodiacSigns = [
            { name: "Capricorn", start: [1, 20], end: [2, 19] },
            { name: "Aquarius", start: [2, 20], end: [3, 20] },
            { name: "Pisces", start: [3, 21], end: [4, 19] },
            { name: "Aries", start: [4, 20], end: [5, 20] },
            { name: "Taurus", start: [5, 21], end: [6, 21] },
            { name: "Gemini", start: [6, 22], end: [7, 22] },
            { name: "Cancer", start: [7, 23], end: [8, 22] },
            { name: "Leo", start: [8, 23], end: [9, 22] },
            { name: "Virgo", start: [9, 23], end: [10, 23] },
            { name: "Libra", start: [10, 24], end: [11, 22] },
            { name: "Scorpio", start: [11, 23], end: [12, 21] },
            { name: "Sagittarius", start: [12, 22], end: [1, 19] }
        ];

        const chineseZodiac = [
            { year: 1996, animal: "Rat" },
            { year: 1997, animal: "Ox" },
            { year: 1998, animal: "Tiger" },
            { year: 1999, animal: "Rabbit" },
            { year: 2000, animal: "Dragon" },
            { year: 2001, animal: "Snake" },
            { year: 2002, animal: "Horse" },
            { year: 2003, animal: "Goat" },
            { year: 2004, animal: "Monkey" },
            { year: 2005, animal: "Rooster" },
            { year: 2006, animal: "Dog" },
            { year: 2007, animal: "Pig" }
        ];

        document.addEventListener('DOMContentLoaded', function() {
            // Get all necessary DOM elements
            const dobInput = document.getElementById('dob');
            const compareDobInput = document.getElementById('compare-dob');
            const resultsContainer = document.getElementById('results-container');
            const errorMessage = document.getElementById('error-message');
            const shareButton = document.getElementById('share-button');
            const shareLinkDisplay = document.getElementById('share-link');
            const copyLinkButton = document.getElementById('copy-link-button');
            const copyMessage = document.getElementById('copy-message');

            // Get displays for main age
            const ageYearsDisplay = document.getElementById('age-years');
            const ageMonthsDisplay = document.getElementById('age-months');
            const ageDaysDisplay = document.getElementById('age-days');

            // Get displays for total time lived
            const totalDaysDisplay = document.getElementById('total-days');
            const totalHoursDisplay = document.getElementById('total-hours');
            const totalMinutesDisplay = document.getElementById('total-minutes');
            const totalSecondsDisplay = document.getElementById('total-seconds');

            // Get displays for comparative age
            const compareResultDisplay = document.getElementById('compare-result');

            // Get displays for extras
            const zodiacSignDisplay = document.getElementById('zodiac-sign');
            const chineseZodiacDisplay = document.getElementById('chinese-zodiac-sign');
            const funFactDisplay = document.getElementById('fun-fact');
            const lifeMilestoneDisplay = document.getElementById('life-milestone');
            const yearProgressBar = document.getElementById('year-progress-bar');
            const yearProgressText = document.getElementById('year-progress-text');
            const bdayYearsDisplay = document.getElementById('bday-years');
            const bdayMonthsDisplay = document.getElementById('bday-months');
            const bdayDaysDisplay = document.getElementById('bday-days');
            const bdayHoursDisplay = document.getElementById('bday-hours');
            const bdayMinutesDisplay = document.getElementById('bday-minutes');
            const bdaySecondsDisplay = document.getElementById('bday-seconds');


            let totalTimeInterval;
            let nextBirthdayInterval;

            // Load birth date from local storage or URL parameter on initial load
            function loadBirthDate() {
                const urlParams = new URLSearchParams(window.location.search);
                const dobFromUrl = urlParams.get('dob');
                const dobFromStorage = localStorage.getItem('birthDate');

                if (dobFromUrl) {
                    dobInput.value = dobFromUrl;
                    updateDisplays(dobFromUrl);
                } else if (dobFromStorage) {
                    dobInput.value = dobFromStorage;
                    updateDisplays(dobFromStorage);
                }
            }

            // Function to animate a number count up
            function animateNumber(element, start, end, duration) {
                const range = end - start;
                const increment = end > start ? 1 : -1;
                const stepTime = Math.abs(Math.floor(duration / range));
                let current = start;
                const timer = setInterval(() => {
                    current += increment;
                    element.textContent = current;
                    if (current == end) {
                        clearInterval(timer);
                    }
                }, stepTime);
            }

            // Main function to update all displays based on the selected date
            function updateDisplays(birthDateStr) {
                if (!birthDateStr) {
                    resultsContainer.classList.add('hidden');
                    return;
                }

                const birthDate = new Date(birthDateStr);
                const today = new Date();

                // Clear any existing intervals
                clearInterval(totalTimeInterval);
                clearInterval(nextBirthdayInterval);

                // Validation
                if (birthDate > today) {
                    errorMessage.textContent = 'Date of birth cannot be in the future.';
                    resultsContainer.classList.add('hidden');
                    return;
                } else {
                    errorMessage.textContent = '';
                }

                resultsContainer.classList.remove('hidden');

                // Save to local storage
                localStorage.setItem('birthDate', birthDateStr);

                // --- Main Age Calculation ---
                let ageYears = today.getFullYear() - birthDate.getFullYear();
                let ageMonths = today.getMonth() - birthDate.getMonth();
                let ageDays = today.getDate() - birthDate.getDate();

                if (ageMonths < 0 || (ageMonths === 0 && ageDays < 0)) {
                    ageYears--;
                    ageMonths += 12;
                }

                if (ageDays < 0) {
                    ageMonths--;
                    const daysInLastMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
                    ageDays += daysInLastMonth;
                }
                
                ageYearsDisplay.textContent = ageYears;
                ageMonthsDisplay.textContent = ageMonths;
                ageDaysDisplay.textContent = ageDays;

                // --- Total Time Lived Calculation with Animated Counter ---
                function updateTotalTime() {
                    const now = new Date();
                    const diffMs = now.getTime() - birthDate.getTime();
                    const seconds = Math.floor(diffMs / 1000);
                    const minutes = Math.floor(seconds / 60);
                    const hours = Math.floor(minutes / 60);
                    const days = Math.floor(hours / 24);

                    totalDaysDisplay.textContent = days;
                    totalHoursDisplay.textContent = hours % 24;
                    totalMinutesDisplay.textContent = minutes % 60;
                    totalSecondsDisplay.textContent = seconds % 60;
                }
                updateTotalTime();
                totalTimeInterval = setInterval(updateTotalTime, 1000);

                // --- Next Birthday Countdown ---
                function updateNextBirthday() {
                    const now = new Date();
                    const currentYear = now.getFullYear();
                    const birthMonth = birthDate.getMonth();
                    const birthDay = birthDate.getDate();

                    let nextBirthday = new Date(currentYear, birthMonth, birthDay);
                    if (nextBirthday < now) {
                        nextBirthday.setFullYear(currentYear + 1);
                    }
                    
                    const diffMs = nextBirthday.getTime() - now.getTime();
                    const seconds = Math.floor(diffMs / 1000);
                    const minutes = Math.floor(seconds / 60);
                    const hours = Math.floor(minutes / 60);
                    const days = Math.floor(hours / 24);
                    const months = Math.floor(days / 30.44); // Approx
                    
                    bdayDaysDisplay.textContent = days % 30; // Approx
                    bdayHoursDisplay.textContent = hours % 24;
                    bdayMinutesDisplay.textContent = minutes % 60;
                    bdaySecondsDisplay.textContent = seconds % 60;
                }
                updateNextBirthday();
                nextBirthdayInterval = setInterval(updateNextBirthday, 1000);

                // --- Zodiac Sign ---
                const birthMonth = birthDate.getMonth() + 1; // getMonth() is 0-indexed
                const birthDay = birthDate.getDate();
                let zodiac = "Unknown";
                for (const sign of zodiacSigns) {
                    const startMonth = sign.start[0];
                    const startDay = sign.start[1];
                    const endMonth = sign.end[0];
                    const endDay = sign.end[1];
                    
                    if (
                        (birthMonth === startMonth && birthDay >= startDay) ||
                        (birthMonth === endMonth && birthDay <= endDay) ||
                        (startMonth > endMonth && (birthMonth === startMonth || birthMonth === endMonth))
                    ) {
                        zodiac = sign.name;
                        break;
                    }
                }
                zodiacSignDisplay.textContent = zodiac;

                // --- Chinese Zodiac ---
                const birthYear = birthDate.getFullYear();
                const startYear = 1900; // Starting year for the 12-year cycle
                const chineseAnimalIndex = (birthYear - startYear) % 12;
                const chineseZodiacAnimal = chineseZodiac.find(animal => (birthYear - animal.year) % 12 === 0);
                chineseZodiacDisplay.textContent = chineseZodiacAnimal ? chineseZodiacAnimal.animal : "Unknown";

                // --- Year Progress ---
                const startOfYear = new Date(today.getFullYear(), 0, 1);
                const endOfYear = new Date(today.getFullYear(), 11, 31);
                const totalDaysInYear = (endOfYear - startOfYear) / (1000 * 60 * 60 * 24) + 1;
                const daysPassed = (today - startOfYear) / (1000 * 60 * 60 * 24);
                const progressPercentage = (daysPassed / totalDaysInYear) * 100;
                
                yearProgressBar.style.width = `${progressPercentage.toFixed(2)}%`;
                yearProgressText.textContent = `${progressPercentage.toFixed(2)}% of your year is over.`;

                // --- Fun Fact and Life Milestones ---
                funFactDisplay.textContent = funFacts[birthYear] || "No fun fact found for this year.";
                updateLifeMilestone(ageYears);
            }
            
            // Function to update life milestone
            function updateLifeMilestone(age) {
                let milestoneText = "";
                if (age >= 10 && age < 20) {
                    milestoneText = `You have been alive for over ${age} years.`;
                } else if (age >= 20 && age < 30) {
                    milestoneText = `You are a young adult! You've likely experienced many new things.`;
                } else if (age >= 30 && age < 40) {
                    milestoneText = `Congratulations on reaching your thirties! This is a great time for growth.`;
                } else if (age >= 40 && age < 50) {
                    milestoneText = `You've lived through more than half a dozen U.S. presidencies.`;
                } else if (age >= 50) {
                    milestoneText = `You've been alive for over ${age * 365} days. You are a true veteran!`;
                }
                lifeMilestoneDisplay.textContent = milestoneText;
            }
            
            // --- Comparative Age Calculation ---
            function compareAges() {
                const birthDateStr1 = dobInput.value;
                const birthDateStr2 = compareDobInput.value;

                if (!birthDateStr1 || !birthDateStr2) {
                    compareResultDisplay.textContent = "Please enter both dates to compare.";
                    return;
                }

                const birthDate1 = new Date(birthDateStr1);
                const birthDate2 = new Date(birthDateStr2);

                const diff = Math.abs(birthDate1 - birthDate2);
                const diffYears = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
                const diffMonths = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
                const diffDays = Math.floor((diff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
                
                let resultText = "";
                if (birthDate1 > birthDate2) {
                    resultText = `You are ${diffYears} years, ${diffMonths} months, and ${diffDays} days younger.`;
                } else if (birthDate2 > birthDate1) {
                    resultText = `You are ${diffYears} years, ${diffMonths} months, and ${diffDays} days older.`;
                } else {
                    resultText = "You were born on the same day!";
                }

                compareResultDisplay.textContent = resultText;
            }


            // --- Event Listeners ---
            dobInput.addEventListener('change', (e) => {
                updateDisplays(e.target.value);
            });
            compareDobInput.addEventListener('change', compareAges);

            shareButton.addEventListener('click', () => {
                if (dobInput.value) {
                    const baseUrl = window.location.origin + window.location.pathname;
                    const shareUrl = `${baseUrl}?dob=${dobInput.value}`;
                    shareLinkDisplay.textContent = shareUrl;
                }
            });

            copyLinkButton.addEventListener('click', () => {
                const linkText = shareLinkDisplay.textContent;
                if (linkText) {
                    // Use a modern clipboard API
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(linkText)
                            .then(() => {
                                copyMessage.textContent = 'Copied!';
                                copyMessage.classList.add('show');
                                setTimeout(() => copyMessage.classList.remove('show'), 2000);
                            })
                            .catch(err => {
                                console.error('Failed to copy text: ', err);
                            });
                    } else {
                        // Fallback for older browsers
                        const tempInput = document.createElement('input');
                        document.body.appendChild(tempInput);
                        tempInput.value = linkText;
                        tempInput.select();
                        document.execCommand('copy');
                        document.body.removeChild(tempInput);
                        copyMessage.textContent = 'Copied!';
                        copyMessage.classList.add('show');
                        setTimeout(() => copyMessage.classList.remove('show'), 2000);
                    }
                }
            });

            // Initial load
            loadBirthDate();
        });