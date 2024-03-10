// var shareImageButton = document.querySelector('#share-image-button');
// var createPostArea = document.querySelector('#create-post');
// var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
var card_list = document.querySelector('#cards-list');

// function openCreatePostModal() {
//   createPostArea.style.display = 'block';
//   if (deferredPrompt) {
//     deferredPrompt.prompt();

//     deferredPrompt.userChoice.then(function(choiceResult) {
//       console.log(choiceResult.outcome);

//       if (choiceResult.outcome === 'dismissed') {
//         console.log('User cancelled installation');
//       } else {
//         console.log('User added to home screen');
//       }
//     });

//     deferredPrompt = null;
//   }

// }

// function closeCreatePostModal() {
//   createPostArea.style.display = 'none';
// }

// shareImageButton.addEventListener('click', openCreatePostModal);

// closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

// Currently not in use, allows to save assets in cache on demand otherwise
function onSaveButtonClicked(event) {
  console.log('clicked');
  if ('caches' in window) {
    caches.open('user-requested')
      .then(function(cache) {
        cache.add('https://httpbin.org/get');
        cache.add('/src/images/sf-boat.jpg');
      });
  }
}

function clearCards() {
  while(card_list.hasChildNodes()) {
    card_list.removeChild(card_list.lastChild);
  }
}

function createCard(data) {
  var cardWrapper = document.createElement('div');
  cardWrapper.className = 'card';
  cardWrapper.addEventListener('click', function() {
    var url = 'detail.html';
    url += '?title=' +data.title;
    url += '&description=' + data.description;
    url += '&image=' + data.image;

    console.log(url);
    window.location.href = url;
  });
  var cardTitle = document.createElement('div');
  cardTitle.className = 'card_title title-white';
  var cardImage = document.createElement('div');
  cardImage.className = 'card_image';
  var cardImage_contain = document.createElement('img');
  cardImage_contain.setAttribute('src', data.image);
  cardImage_contain.src = data.image;
  cardImage.appendChild(cardImage_contain);
  cardWrapper.appendChild(cardImage);
  cardWrapper.appendChild(cardTitle);
  var cardTitleTextElement = document.createElement('p');
  cardTitleTextElement.style.textAlign = 'center';
  cardTitleTextElement.style.borderRadius ='0px 0px 40px 40px';
  cardTitleTextElement.style.fontFamily ='sans-serif';
  cardTitleTextElement.style.fontWeight = 'bold';
  cardTitleTextElement.style.fontSize = '30px';
  cardTitleTextElement.style.height = '40px';
  cardTitleTextElement.textContent = data.title;
  cardTitle.appendChild(cardTitleTextElement);
  // var cardSaveButton = document.createElement('button');
  // cardSaveButton.textContent = 'Save';
  // cardSaveButton.addEventListener('click', onSaveButtonClicked);
  // cardSupportingText.appendChild(cardSaveButton);
  componentHandler.upgradeElement(cardWrapper);
  card_list.appendChild(cardWrapper);
}

function updateUI(data) {
  clearCards();
  for (var i = 0; i < data.length; i++) {
    createCard(data[i]);
  }
}

var url = 'https://tes1-ambw-c14210139-default-rtdb.firebaseio.com/activity.json';
var networkDataReceived = false;

fetch(url)
  .then(function(res) {
    return res.json();
  })
  .then(function(data) {
    networkDataReceived = true;
    console.log('From web', data);
    var dataArray = [];
    for (var key in data) {
      dataArray.push(data[key]);
    }
    updateUI(dataArray);
  });

if ('indexedDB' in window) {
  readAllData('posts')
    .then(function(data) {
      if (!networkDataReceived) {
        console.log('From cache', data);
        updateUI(data);
      }
    });
}
