
console.log('peek is running');

window.onload=function(){
  var rhs = document.getElementById('rhs');
  rhs.innerHTML += peekInsert;
  getUrlResults();
}

function getUrlResults(){
  //gets all the search result links
  var links = document.getElementById('rso').querySelectorAll('a');
  var filteredLinks = [];

  for(var i = 0; i < links.length; i++){
    //fillters for only the search results and also makes sure to not
    //include more google searches which would get our ip's most likely banned
    if(!links[i].href.includes('https://www.google.com/search') &&
    links[i].innerHTML.includes(links[i].href.substring
      (8, links[i].href.indexOf('.'))
    )){
      filteredLinks.push(links[i]);
    }
  }

//for only the first 20 request image so that we know it will be downloaded
//and also add event listners for hovering
  for(var  i = 0; i < 20; i++){
    filteredLinks[i].addEventListener("mouseover", function(event){
      hoverUrl(event);
    });
  }
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
    console.log('fail');
    return;
  }
  //get the peek peekInsert
  var peekInsert = document.getElementById('peekOutsideDiv');

  //then get the domain from the hover element for display
  var domain = currentElement.querySelector('cite')
  if(domain == null){
     console.log('domain is nul');
     return;
  }
  domain = domain.innerText;
  //set the domain label in the peek insert to the current hover domain
  peekInsert.querySelector('#domainLabel').innerHTML = domain;

  //then get the result title from the hover element for display
  var title = currentElement.querySelector('h3');
  if(title == null){
    console.log('title is nul');
    return;
  }
  title = title.innerHTML;
  //set the title in the peek insert to the current hover title
  peekInsert.querySelector('#titleLabel').innerHTML = title;
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
      <img src="http://localhost:3000/resources/noImage.png" style="\
        display: block;\
        width: 400px;\
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
