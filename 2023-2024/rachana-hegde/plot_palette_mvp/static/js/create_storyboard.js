// CREATE NEW STORYBOARD FUNCTIONALITY

document.addEventListener('DOMContentLoaded', function() {

    // Handle form data when user adds custom options for genre, themes or image style
    document.getElementById('add-genre').addEventListener('click', function() {
        const customGenreInput = document.getElementById('custom-genre');
        const customGenre = customGenreInput.value.trim();

        if (customGenre) {
            // Make the checkbox
            const newCheckbox = document.createElement('input');
            newCheckbox.type = 'checkbox';
            newCheckbox.name = 'genre[]';
            newCheckbox.value = customGenre;

            // Make the label and place it on a new line
            const newLabel = document.createElement('label');
            newLabel.appendChild(newCheckbox);
            newLabel.append(` ${customGenre}`);

            const br = document.createElement('br');  // Add break after label

            const genreDiv = document.querySelector('.genre-div');
            const customGenreDiv = document.getElementById('custom-genre-div');

            genreDiv.insertBefore(newLabel, customGenreDiv);
            genreDiv.insertBefore(br, customGenreDiv);

            customGenreInput.value = '';
        }
    });

    document.getElementById('add-theme').addEventListener('click', function() {
        const customThemeInput = document.getElementById('custom-theme');
        const customTheme = customThemeInput.value.trim();

        if (customTheme) {
            const newCheckbox = document.createElement('input');
            newCheckbox.type = 'checkbox';
            newCheckbox.name = 'themes[]';
            newCheckbox.value = customTheme;

            const newLabel = document.createElement('label');
            newLabel.appendChild(newCheckbox);
            newLabel.append(` ${customTheme}`);

            const br = document.createElement('br');

            const themesDiv = document.querySelector('.themes-div');
            const customThemeDiv = document.getElementById('custom-theme-div');

            themesDiv.insertBefore(newLabel, customThemeDiv);
            themesDiv.insertBefore(br, customThemeDiv);

            customThemeInput.value = '';
        }
    });

    document.getElementById('add-style').addEventListener('click', function() {
        const customStyleInput = document.getElementById('custom-style');
        const customStyle = customStyleInput.value.trim();

        if (customStyle) {
            const newCheckbox = document.createElement('input');
            newCheckbox.type = 'checkbox';
            newCheckbox.name = 'styles[]';
            newCheckbox.value = customStyle;

            const newLabel = document.createElement('label');
            newLabel.appendChild(newCheckbox);
            newLabel.append(` ${customStyle}`);

            const br = document.createElement('br');

            const stylesDiv = document.querySelector('.image-style-div');
            const customStyleDiv = document.getElementById('custom-style-div');

            stylesDiv.insertBefore(newLabel, customStyleDiv);
            stylesDiv.insertBefore(br, customStyleDiv);

            customStyleInput.value = '';
        }
    });

    // Store form data with StoreJS API in LocalStorage when user clicks on the Create button
    // TODO Validate form inputs - make sure that user hasn't entered duplicate or null/empty values for the custom inputs
    document.getElementById('create-project').addEventListener('click', function() {
        const title = document.getElementById('title').value;
        const summary = document.getElementById('summary').value;

        // Prevent form submission if title or summary fields are empty
        if (!title || !summary) {
            alert('Enter the title and summary.');
            return;
        }

        // Get remaining data from form

        // Collect values of checkboxes with genre attribute checked
        // Store values in genres array
        const genres = [];
        document.querySelectorAll('input[name="genre[]"]:checked').forEach((checkbox) => {
            genres.push(checkbox.value);
        });

        const themes = [];
        document.querySelectorAll('input[name="themes[]"]:checked').forEach((checkbox) => {
            themes.push(checkbox.value);
        });

        const styles = [];
        document.querySelectorAll('input[name="styles[]"]:checked').forEach((checkbox) => {
            styles.push(checkbox.value);
        });

        // Store the form details in a storyboardDetails object
        const storyboardDetails = {
            title,
            summary,
            genres,
            themes,
            styles,
        };

        // Note - form data for a single project will be stored at a time so each time the form is resubmitted,
        // the data will be overwritten with the new details.
        store.set('storyboardDetails', storyboardDetails);

        // Redirect the user to storyboard.html after button click
        window.location.href = 'storyboard';
    });

    const detailsDataCheck = store.get('storyboardDetails');
    console.log(detailsDataCheck);

});
