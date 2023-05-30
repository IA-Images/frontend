
let currentImageId = -1;

function submitReview(e) {
    if (e.preventDefault) e.preventDefault();
    //

    submitModeration(e.submitter)
    updateButtonStateToLoading(e.submitter);
    disableAllButtons();
}

function submitModeration(button) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.ia-images.ru/images/review", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    let jsonData = JSON.stringify({
        isSafe: button.value === "approve",
        id: currentImageId
    })

    xhr.send(jsonData);
    xhr.onerror = async function () {
        updateSendButtonStateToDefault()
    }
    xhr.onload = async function () {
        updateViewStateToSuccess()
        setTimeout(function() {
            location.reload();
        }, 2000);
    }
}

function updateViewStateToSuccess() {
    let buttonApprove = document.getElementById('approveButton');
    let buttonReject = document.getElementById('rejectButton');
    buttonApprove.style.visibility = 'hidden';
    buttonReject.style.visibility = 'hidden';

    let successLabel = document.getElementById('successLabel');
    successLabel.hidden = false;
    successLabel.style.opacity = '1';
}

function updateSendButtonStateToDefault() {
    let button = document.getElementById('sendImageLabelingButton');
    let spinner = button.querySelector('.spinner-border');
    spinner.hidden = true;
    button.firstChild.data = 'Отправить';
    button.disabled = false;
}
function disableAllButtons() {
    let buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.disabled = true;
    });
}
function updateButtonStateToLoading(button) {
    let spinner = button.querySelector('.spinner-border');
    spinner.hidden = false;
    button.firstChild.data = '';
    button.disabled = true;
}

function fetchImageForReview() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.ia-images.ru/images/review", true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onerror = async function () {
      console.log("cannot download image")
    }
    xhr.onload = async function () {
        const jsonData = JSON.parse(xhr.responseText);
        const imageUrl = jsonData.url;
        currentImageId = jsonData.id;
        let image = document.getElementById("imageForModeration")
        image.src = imageUrl;

        setTimeout(function() {
            let buttonApprove = document.getElementById('approveButton');
            let buttonReject = document.getElementById('rejectButton');
            buttonApprove.disabled = false;
            buttonReject.disabled = false;
        }, 2000);
    }

    xhr.send();
}

window.addEventListener('load', fetchImageForReview);

let form = document.getElementById('submitModerationForm');
if (form.attachEvent) {
    console.log("attach")
    form.attachEvent("submit", submitReview);
} else {
    console.log("listener")
    form.addEventListener("submit", submitReview);
}

