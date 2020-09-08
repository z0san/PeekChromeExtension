
console.log('peek is running');

var loadingImg = 'http://localhost:3000/resources/loading.gif';
var apiUrl = 'http://localhost:3000/imagefetcher?url=';


//will store all results
var results = [];

window.onload=function(){
  var rhs = document.getElementById('rhs');
  rhs.innerHTML += peekInsert;
  getUrlResults();
  updateCurImg();
}



function getUrlResults(){
  //gets all the search result links
  var links = document.getElementById('rso').querySelectorAll('a');

  //will be populated by all the results html info
  var filteredLinks = [];

  for(var i = 0; i < links.length; i++){
    //fillters for only the search results and also makes sure to not
    //include more google searches which would get our ip's most likely banned
    if(!links[i].href.includes('https://www.google.com/search') &&
    links[i].innerHTML.includes(links[i].href.substring
      (8, links[i].href.indexOf('.'))
    ) && links[i].href != null && links[i].href != '' &&
    findDomain(links[i]) != null && findTitle(links[i]) != null){
      filteredLinks.push(links[i]);
    }
  }

  //for only the first 20 request image so that we know it will be downloaded
  for(var  i = 0; i < 10; i++){
    //add marker so we know what number result it is
    filteredLinks[i].className += i;
    //add event listners for hovering
    filteredLinks[i].addEventListener("mouseover", function(event){
      hoverUrl(event);
    });
    //create results objects so easier to find later
    results.push({
      id: i,
      data: filteredLinks[i],
      url: filteredLinks[i].href,
      domain: findDomain(filteredLinks[i]),
      title: findTitle(filteredLinks[i])
    });
  }
  requestImgs(0);
}


//function to loop and see if the current peek image needs to be fetched from server
function updateCurImg(){
  console.log('attempting to update current image');


  //get the peek peekInsert
  var peekInsert = document.getElementById('peekOutsideDiv');
  if(peekInsert.currentId) var result = results[peekInsert.currentId];

  if(peekInsert.currentId && !result.hasImg){
    console.log('requesting image for id: ' + peekInsert.currentId);
    //if the image has not been downloaded yet then send another request to the server
    requestSingleImg(peekInsert.currentId, function(){});
  }

  setTimeout(function(){updateCurImg()}, 1000);
}

//function to send ajax request for images in filteredLinks
function requestImgs(index){
  //if we have downloaded all the images just return
  if(index >= results.length) {
    console.log('all images have been requested');
    console.log(results);
    return;
  }
  console.log('index: ' + index);

  //request the single image

  requestSingleImg(index, function(){});
  requestImgs(index + 1);
}

//function to retrieve single images
//assumes image has not alread been downloaded
function requestSingleImg(index, callback){
  //the current result we are downloading an image for
  var result = results[index];

  //in the case of invalid index throw error
  if(result == undefined){
    console.log(index + ' is not a valid index!');
    callback();
    return;
  }

  //in case of errors
  if(result.url == '') {
    console.log('error collecting results');
    callback();
  }
  console.log('requesting ' + result.url);
  var xhttp = new XMLHttpRequest();
  //on response
  xhttp.onreadystatechange = function() {
    //console.log('status: ' + this.status);

    if(this.status == 200 && this.responseText != ''){
      //console.log('successfully found img, loading it in now');
      var data;
      //catch error reading json often syntax error, unexpected end of JSON input
      try {
        data = JSON.parse(this.responseText);
      }
      catch (e){
        callback();
        return;
      }

      //console.log('data: ' + JSON.stringify(data));

      //now we will be updating the result with the image data
      result.imgSrc = 'data:image/jpeg;base64,' + (data.img.base64);
      result.hasImg = true;

      //if the curser is still hovering over this result then display this image in the peek window
      //get the peek peekInsert
      var peekInsert = document.getElementById('peekOutsideDiv');

      if(peekInsert.currentId == result.id){
        peekInsert.querySelector('#screenShot').src = result.imgSrc;
      }

      //run the callback
      callback();
    } else if(this.status ==  204){
      //console.log('image not donwloaded yet');
      //setTimeout(function(){requestImg(index);}, 500);

      result.hasImg = false;
      //run the callback
      callback();
    } else if(this.status != 0){
      //all other situations except for response of 0
      result.hasImg = false;
      //run the callback
      callback();

    }
  };
  //set the method and url
  xhttp.open("GET", apiUrl + result.url, true);
  //send http request
  xhttp.send();
}

function findDomain(currentElement){
  //then get the domain from the hover element for display
  var domain = currentElement.querySelector('cite')
  if(domain == null){
     console.log('domain is nul');
     return null;
  }
  domain = domain.innerText;
  return domain;
}

//gets the title of the search result
function findTitle(currentElement){
  //then get the result title from the hover element for display
  var title = currentElement.querySelector('h3');
  if(title == null){
    console.log('title is nul');
    return null;
  }
  title = title.innerHTML;

  return title;
}



//function that gets run on hover of one of the results
function hoverUrl(event){
  var currentElement = event.fromElement;
  //if we didn't get the div object we wanted then we keep going to parent nodes
  //untill we reach body or we reach the desired node
  while(currentElement.className != 'r' &&
  currentElement.localName != 'body'){
    currentElement = currentElement.parentNode;
  }
  if(currentElement.localName == 'body'){
    return;
  }
  //get the index value of the current hover result
  var result = results[Number(currentElement.querySelector('a').className)]


  console.log('currently hovering over result ' + result.id);
  //get the peek peekInsert
  var peekInsert = document.getElementById('peekOutsideDiv');

  //set peekInsert current id value
  peekInsert.currentId = result.id;

  //set the domain label in the peek insert to the current hover domain
  peekInsert.querySelector('#domainLabel').innerHTML = result.domain;
  //set the title in the peek insert to the current hover title
  peekInsert.querySelector('#titleLabel').innerHTML = result.title;

  //set the picture in the peek insert to the current hover screenshot
  //if we have already recieved an image for this site
  if(result.hasImg){
    peekInsert.querySelector('#screenShot').src = result.imgSrc;
  }else{
    //display loadingImg
    peekInsert.querySelector('#screenShot').src =
    'http://localhost:3000/resources/loading.gif';

  }


  return;
}


var peekInsert = '\
<div class="outerBox" id="peekOutsideDiv" style="\
    width: 457;\
    border: 1px solid #dfe1e5;\
    border-radius: 8px;\
    padding: 0 0 16px 0;\
    margin-top: -10px;\
  ">\
  <div class="content" id="contentDiv" style="">\
    <div class="banner" id="logo" style="\
      padding: 5px 10px 5px 10px;\
      border-bottom: 1px solid #dfe1e5;\
    ">\
      <div class="image" style="\
        display: inline-block;\
        vertical-align: middle;\
      ">\
        <img src="http://localhost:3000/resources/icon32.png">\
        </div>\
      <div class="labelText" style="\
        display: inline-block;\
        font-family: Roboto,arial,sans-serif;\
        font-size: 18px;\
      ">\
        Peek Viewer:\
      </div>\
    </div>\
    <div class="mainBox" style="\
      padding: 0 19px 0 19px;\
    ">\
      <img id="screenShot" src="http://localhost:3000/resources/noImage.png" style="\
        display: block;\
        width: 400px;\
        height: 225px;\
        margin: 10px 0 10px 0;\
        border: 1px solid #dfe1e5;\
        border-radius: 8px;\
      ">\
      <a class="urlText" href="https://google.com" id="titleLabel" style="\
        font-size: 18px;\
        font-family: Roboto,arial,sans-serif;\
        display: block;\
      ">\
        Place Holder\
      </a>\
      <a class="urlLink" href="https://google.com" id="domainLabel" style="\
        font-size: 14px;\
        padding-top: 1px;\
        color: #202124;\
        font-family: Roboto,arial,sans-serif;\
      ">\
        www.placeholder.net\
      </a>\
    </div>\
  </div>\
</div>\
';


/*
TODO:

- write image request for all urls
- display image for hover and loading if loading
*/
