var currentTheme = ""
$(document).ready(function () {
  get()
  getPageTheme()
  setPageTheme(currentTheme)
})

function addList() {

  var giturl = $('.git-input').val();
  giturl = giturl + ".atom";

  if (validURL(giturl) && giturl.includes("releases.atom") && giturl.includes("github.com")) {

    set("https://gitcors.herokuapp.com/" + giturl)
  }
  else {
    window.alert("Failed to add to list, Make sure you have the correct url")
    console.log("not epic")
  }
}

var gitList = [];

function set(url) {

  if (localStorage.getItem("git") !== null) {
    var gitListOld = localStorage.getItem('git')
    gitList = JSON.parse(gitListOld)
    //console.log(gitList)
    if (!gitList.includes(url)) {
      gitList.push(url)
      localStorage.setItem("git", JSON.stringify(gitList));
    }
  } else {
    gitList.push(url)
    localStorage.setItem("git", JSON.stringify(gitList));
  }

  $('.toast').toast('show')
  get();
}

function get() {
  var gitListOld = localStorage.getItem('git')
  gitList = JSON.parse(gitListOld)
  console.log(gitList)
  populateData();
}

function populateData() {

  if (gitList.length > 0) {
    document.getElementById('list-cont').innerHTML = "";
    for (x = 0; x < gitList.length; x++) {
      var feed = gitList[x];
      var title = "";
      var release = "";
      var version = "";
      var author = "";
      var img_url = "";

      $.get(feed, function (data) {
        console.log($(data).find("title").first().text())

        title = $(data).find("title").first().text().replace("Release notes from ", "")

        var el = $(data).find("entry")[0];
        var releaseOld = $(el).find("updated").text();
        version = $(el).find("title").text();
        author = $(el).find("author").text();
        img_url = $(el).find('media\\:thumbnail, thumbnail').attr('url');
        console.log(img_url)
        var d = new Date(releaseOld);
        release = d.toLocaleDateString()

        document.getElementById('list-cont').innerHTML += `<div class="tb-main-cont my-4">
      <div class="tb-main">
        <div class="tr-img px-2">
              <img class="feed-icon" src="${img_url}" alt="Icon">
          </div>
          <div class="tr-name-cont"> 
            <div class="tr-name">
              ${title}
            </div>
            <div class="tr-author">
              By ${author}
            </div>
          </div>
          <div class="tr-ver">
              ${version}
          </div>
          <div class="tr-date">
              ${release}
          </div>
          <div class="tr-btinfo mx-3">
              <a><i class="bi bi-chevron-down"></i></a>
          </div>
      </div>
      <div class="tb-more-options ml-2">
          <div class="tr-btdel mx-2">
              <a><i class="bi bi-trash2"></i></a>
          </div>
          <div class="tr-btmore mx-2">
              <a><i class="bi bi-three-dots-vertical"></i></a>
          </div>
      </div>
    </div>`;

      });
    }
  }
}

function validURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(str);
}

function test() {

}

function getPageTheme() {
  if (localStorage.getItem("theme") !== null) {
    currentTheme = localStorage.getItem("theme")
  } else {
    localStorage.setItem("theme", "light");
    currentTheme = "light"
  }
}

function setPageTheme(theme) {
  if (theme === 'light') {
    $("#theme-icon").removeClass("bi-sun").addClass("bi-moon")
  }
  else {
    $("#theme-icon").removeClass("bi-moon").addClass("bi-sun")
  }

  $("body").removeClass().addClass(currentTheme);
}

function changePageTheme() {

  if (currentTheme === 'light') {
    currentTheme = 'dark'
  }
  else {
    currentTheme = 'light'
  }
  localStorage.setItem('theme', currentTheme)
  setPageTheme(currentTheme)

}


