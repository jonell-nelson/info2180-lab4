document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('searchbtn');
    const heroList = document.getElementById('superheroesList');
    const searchInput = document.getElementById('searchInput');  

    searchButton.addEventListener('click', function (event) {
        // Prevent the form from submitting and page refreshing
        event.preventDefault();  

        const searchTerm = searchInput.value.trim();
        
        // Check if the input contains common code-like patterns
        if (containsCode(searchTerm)) {
            alert('Input seems to contain code.');
            return; // Exit if code is detected
        } 

        // Make an AJAX request to superheroes.php with the search term as a query parameter
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    // Parse the JSON response
                    const superheroes = JSON.parse(xhr.responseText);
                    
                    // Check if any superheroes were returned
                    if (superheroes.length > 0) {
                        displaySuperheroes(superheroes);
                    } else {
                        heroList.innerHTML = '<li class="not-found">Superhero not found</li>';
                    }
                } else {
                    // Handle error
                    console.error('Error fetching superheroes:', xhr.status);
                }
            }
        };

        // Open the request with the search term as a query parameter
        xhr.open('GET', 'superheroes.php?query=' + encodeURIComponent(searchTerm), true);
        xhr.send();
    });

    // Function to display the full list of superheroes
    function displaySuperheroes(superheroes) {
        heroList.innerHTML = ''; // Clear the previous content

        superheroes.forEach(superhero => {
            const superheroItem = document.createElement('li');
            superheroItem.classList.add('superhero-item');
            superheroItem.innerHTML = `<strong>${superhero.alias}</strong> - ${superhero.name}`;
            heroList.appendChild(superheroItem);
        });
    }

    // Function to check for common code-like patterns
    function containsCode(input) {
        const codePatterns = [
            /<script.*?>.*?<\/script>/gi, // Script tags
            /<style.*?>.*?<\/style>/gi,   // Style tags
            /<.*?on.*?=.*?>.*?<\/.*?>/gi, // Event attributes
            /javascript:/gi,              // JavaScript protocol
            /&#x.{1,6};/gi                // Hexadecimal entities
        ];

        return codePatterns.some(pattern => pattern.test