let currentImageId = -1;

function sendImageLabelingForm(singleWord, description, emotions) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.ia-images.ru/annotations", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    let jsonData = JSON.stringify({
        singleWord: singleWord,
        description: description,
        emotions: emotions,
        id: currentImageId
    })
    console.log(jsonData)
    xhr.send(jsonData);
    xhr.onerror = async function () {
        resetImageLabelingForm()
    }
    xhr.onload = async function () {
        updateStateToSuccess()
        setTimeout(function() {
            location.reload();
        }, 1000);
    }
}

function processSubmitImageLabelingForm(e) {
    if (e.preventDefault) e.preventDefault();
    //
    let singleWordInput = document.getElementById('single-word');
    let descriptionInput = document.getElementById('description');
    let emotionsInput = document.getElementById('emotions');

    singleWordInput.disabled = true;
    descriptionInput.disabled = true;
    emotionsInput.disabled = true;

    updateSendButtonStateToLoading();

    sendImageLabelingForm(singleWordInput.value,
        descriptionInput.value,
        emotionsInput.value)
}

function resetImageLabelingForm() {
    let singleWordInput = document.getElementById('single-word');
    let descriptionInput = document.getElementById('description');
    let emotionsInput = document.getElementById('emotions');
    singleWordInput.disabled = false;
    descriptionInput.disabled = false;
    emotionsInput.disabled = false;

    updateSendButtonStateToDefault()
}

function updateSendButtonStateToDefault() {
    let button = document.getElementById('sendImageLabelingButton');
    let spinner = button.querySelector('.spinner-border');
    spinner.hidden = true;
    button.firstChild.data = 'Отправить';
    button.disabled = false;
}

function updateSendButtonStateToLoading() {
    let button = document.getElementById('sendImageLabelingButton');
    let spinner = button.querySelector('.spinner-border');
    spinner.hidden = false;
    button.firstChild.data = '';
    button.disabled = true;
}

function fetchImage() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.ia-images.ru/images", true);
    xhr.setRequestHeader('Content-Type', 'application/json');


    xhr.onerror = async function () {

    }
    xhr.onload = async function () {
        const jsonData = JSON.parse(xhr.responseText);
        const imageUrl = jsonData.url;
        currentImageId = jsonData.id;
        let image = document.getElementById("imageForLabeling")
        image.src = imageUrl;

        setTimeout(function() {
            let buttonApprove = document.getElementById('sendImageLabelingButton');
            buttonApprove.disabled = false;
        }, 2000);
    }

    xhr.send();
}



function updateStateToSuccess() {
    let button = document.getElementById('sendImageLabelingButton');
    button.style.visibility = 'hidden';

    let successLabel = document.getElementById('successLabel');
    successLabel.hidden = false;
}

let form = document.getElementById('submitImageLabelingForm');
if (form.attachEvent) {
    console.log("attach")
    form.attachEvent("submit", processSubmitImageLabelingForm);
} else {
    console.log("listener")
    form.addEventListener("submit", processSubmitImageLabelingForm);
}

window.addEventListener('load', fetchImage);