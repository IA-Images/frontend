function previewImage(event) {
    let input = event.target;
    let previewImg = document.getElementById('imagePreview');

    var approveButton = document.getElementById('approveButton');
    approveButton.hidden = false;

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            previewImg.src = e.target.result;
            previewImg.style.display = 'block';
        }

        reader.readAsDataURL(input.files[0]);
    } else {
        previewImg.src = '';
        previewImg.style.display = 'none';
    }
}


function submitImageToReview(e) {
    if (e.preventDefault) e.preventDefault();

    updateButtonStateToLoading(e.submitter);
    uploadImage(e.submitter);
    disableAllButtons();
}

function updateButtonStateToSuccess(button) {
    button.style.visibility = 'hidden'
    let imageInputLabel = document.getElementById('imageInputLabel');
    let successLabel = document.getElementById('successLabel');
    let fileInput = document.getElementById('imageInput');
    successLabel.hidden = false;
    fileInput.disabled = true;
    imageInputLabel.style.color = "grey";
}

function updateButtonStateToDefault(button) {
    let spinner = button.querySelector('.spinner-border');
    spinner.hidden = true;
    button.firstChild.data = 'Отправить';
    button.disabled = false;
}

function updateButtonStateToLoading(button) {
    let spinner = button.querySelector('.spinner-border');
    spinner.hidden = false;
    button.firstChild.data = '';
    button.disabled = true;
}

function disableAllButtons() {
    let buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.disabled = true;
    });
}

function uploadImage(button) {
    var fileInput = document.getElementById('imageInput');
    var file = fileInput.files[0];

    // Create a FormData object and append the file to it
    var formData = new FormData();
    formData.append('body', file);

    // Create an AJAX request
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.ia-images.ru/images', true);


    // Define the event listeners
    xhr.onload = function() {
        if (xhr.status === 200) {
            // File upload successful
            console.log('File uploaded successfully.');
            updateButtonStateToSuccess(button)
            setTimeout(function() {
                location.reload();
            }, 3000);
        } else {
            // File upload failed
            updateButtonStateToDefault(button)
            console.error('File upload failed.');
        }
    };

    xhr.onerror = function() {
        console.error('An error occurred during the file upload.');
    };

    // Send the AJAX request with the form data
    xhr.send(formData);
}


let form = document.getElementById('imageUploadForm');
if (form.attachEvent) {
    console.log("attach")
    form.attachEvent("submit", submitImageToReview);
} else {
    console.log("listener")
    form.addEventListener("submit", submitImageToReview);
}

