var currentTheme = ""
var isMenuOpen = false;
$(document).ready(function () {
  get()
  getPageTheme()
  setPageTheme(currentTheme)
})

function addList() {

  var giturl = $('.git-input').val();

  addUrlToArray(giturl)
}

function addUrlToArray(giturl) {
  if (!giturl.includes("releases"))
    giturl = giturl + "/releases"

  giturl = giturl + ".atom";

  giturl = giturl.replace(/([^:]\/)\/+/g, "$1");
  if (validURL(giturl) && giturl.includes("releases.atom") && giturl.includes("github.com")) {
    set("https://web-production-f2ba.up.railway.app/" + giturl)
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
    if (gitList === null)
      gitList = [];
    gitList.push(url)
    localStorage.setItem("git", JSON.stringify(gitList));
  }

  $('.toast').toast('show')
  get();
}

function delFeed(url) {
  if (confirm("Do you want to delete this feed?")) {
    const index = gitList.indexOf(url);
    console.log(index)
    if (index > -1) {
      gitList.splice(index, 1);
      localStorage.setItem("git", JSON.stringify(gitList));
      populateData();
    }
  } else {
    console.log("epic prank")
  }
}

var mainList = [];

function sortUpRel()
{
  mainList.sort(sortUpFunction)
  populateList(mainList)
}

function sortDownRel()
{
  mainList.sort(sortDownFunction)
  populateList(mainList)
}

function populateList(main_array)
{
  document.getElementById('list-cont').innerHTML = "";
  main_array.forEach(el =>{
    
  var divContentName = el[0];
  var title = el[3];
  var feed_content = el[11];
  var release = el[8];
  var version = el[7];
  var author = el[5];
  var author_link = el[4];
  var img_url = el[1];
  var project_url = el[2];
  var version_url = el[6];
  var daysAgo = el[9];
  var feed_url = el[10];


  document.getElementById('list-cont').innerHTML += `<div id="${divContentName}">
        <div class="tb-main-cont my-4">
          <div class="tb-main">
            <div class="tr-img px-2">
                  <img class="feed-icon" src="${img_url}" alt="">
              </div>
              <div class="tr-name-cont"> 
                <a class="tr-name" href="${project_url}" target="_blank">
                  ${title}
                </a>
                <a class="tr-author" href="${author_link}" target="_blank">
                  By ${author}
                </a>
              </div>
              <div class="tr-ver">
                  <a href="${version_url}" target="_blank">${version}</a>
              </div>
              <div class="tr-date-cont">
                  <div class="tr-date">
                    ${release}
                  </div>
                  <div class="tr-daysago">
                    ${daysAgo} Days Ago
                  </div>
              </div>
              <div class="tr-btinfo mx-3">
                  <a onclick="contVisibility('${divContentName}')"><i id="icon${divContentName}" class="bi bi-chevron-down"></i></a>
              </div>
          </div>
        <div class="tb-more-options ml-2">
            <div class="tr-btdel mx-2">
                <a><i class="bi bi-trash" onclick="delFeed('${feed_url}')"></i></a>
            </div>
            <div class="tr-btmore mx-2 d-none">
                <a onclick="openContextMenu(event)"><i class="bi bi-three-dots-vertical"></i></a>
            </div>
        </div>
        </div>
        <div id="tb${divContentName}" class="tb-content py-2 d-none">
          <div class="tr-descripHeader">
            Description
          </div>
          <div class="tr-descrip">
            ${feed_content}
          </div>
        </div>
      </div>`;
  })
}

function get() {
  var gitListOld = localStorage.getItem('git')
  gitList = JSON.parse(gitListOld)
  console.log(gitList)
  if (gitList !== null) {
    populateData();
    //console.log("done")
    //$(".load-icon").removeClass("d-block").addClass("d-none")
  }
}

function sortUpFunction(a, b) {
  if (a[9] === b[9]) {
      return 0;
  }
  else {
      return (a[9] < b[9]) ? -1 : 1;
  }
}

function sortDownFunction(a, b) {
  if (a[9] === b[9]) {
      return 0;
  }
  else {
      return (a[9] > b[9]) ? -1 : 1;
  }
}

function populateData() {

  var count = 0;
  if (gitList.length > 0) {

    $("#add-main-cont").removeClass("d-block").addClass("d-none")
    $(".load-icon").removeClass("d-none").addClass("d-block")
    $(".cont-list").removeClass("d-none").addClass("d-block")
    mainList = [];
    document.getElementById('list-cont').innerHTML = "";
    for (x = 0; x < gitList.length; x++) {
      var feed = gitList[x];
      var title = "";
      var feed_content = "";
      var release = "";
      var version = "";
      var author = "";
      var author_link = "";
      var img_url = "";
      var project_url = "";
      var version_url = "";
      $(".load-icon").removeClass("d-none").addClass("d-block")

      $.get(feed, function (data) {

        var divContentName = "Cont" + count;
        count++;

        $(".load-icon").removeClass("d-none").addClass("d-block")

        //console.log($(data).find("title").first().text())

        var feed_url = "https://web-production-f2ba.up.railway.app/" + $(data).find("link").first().attr('href') + ".atom";

        project_url = $(data).find("link").first().attr('href').replace("releases", "")

        title = $(data).find("title").first().text().replace("Release notes from ", "")
        //console.log(title)

        author_link = project_url.replace("/" + title, "")
        author = author_link.replace("https://github.com/", "").replace("/", "")

        var el = $(data).find("entry")[0];

        var releaseOld = $(el).find("updated").text();
        //console.log(releaseOld1)

        feed_content = $(el).find("content").text();
        version = $(el).find("title").text();
        //author = $(el).find("author").text().trim();
        img_url = $(el).find('media\\:thumbnail, thumbnail').attr('url');
        //project_url = $(el).find('link').attr('href');
        version_url = $(el).find('link').attr('href');

        var d = new Date(releaseOld);


        d.setDate(d.getDate() - 1)
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        if (monthNames[d.getMonth()] !== undefined)
          release = d.getDate() + "/" + monthNames[d.getMonth()] + "/" + d.getFullYear()
        else
          release = "none"


        var difference = Math.abs(new Date() - d);
        daysAgo = parseInt(difference / (1000 * 3600 * 24))

        var test_array = [divContentName, img_url, project_url, title, author_link, author, version_url, version, release, daysAgo, feed_url, feed_content]
        mainList.push(test_array)
        sortUpRel();

        $(".load-icon").removeClass("d-block").addClass("d-none")
        $(".tr-header-name").text("PROJECT (" + count + ")")
      });
      // $(".load-icon").removeClass("d-block").addClass("d-none")
      

    }
  }
  else {
    $(".cont-list").removeClass("d-block").addClass("d-none")
    $("#add-main-cont").removeClass("d-none").addClass("d-block")
  }
}

function contVisibility(contID) {
  if ($("#tb" + contID).hasClass("d-none")) {
    $("#icon" + contID).removeClass("bi-chevron-down").addClass("bi-chevron-up")
    $("#tb" + contID).removeClass("d-none").addClass("d-block")
  }
  else {
    $("#icon" + contID).removeClass("bi-chevron-up").addClass("bi-chevron-down")
    $("#tb" + contID).removeClass("d-block").addClass("d-none")
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

function openGitPop() {
  $('#githubModalCenter').modal({
    keyboard: false
  })
}

function addProject() {
  var giturl = $("#githubVal").val()
  $('#githubModalCenter').modal('hide')
  addUrlToArray(giturl)

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
    $(".theme-icon").removeClass("bi-sun").addClass("bi-moon")
  }
  else {
    $(".theme-icon").removeClass("bi-moon").addClass("bi-sun")
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

function openMenu(event) {

  isMenuOpen = false;
  if ($(".ham-menu").hasClass("d-flex")) {
    $(".ham-menu").removeClass("d-flex").addClass("d-none")
  } else {
    $(".ham-menu").removeClass("d-none").addClass("d-flex")
  }
}

function openContextMenu(event) {
  isMenuOpen = false;
  var clickY = event.clientY + document.body.scrollTop;
  var clickX = event.clientX + document.body.scrollLeft;
  document.getElementById("context-menu").style.top = (clickY) + "px";

  document.getElementById("context-menu").style.left = (clickX - 50) + "px";
  $("#context-menu").removeClass("d-none").addClass("d-flex")
}

function bodyFunc() {
  if ($(".menu-cont").hasClass("d-flex") && isMenuOpen) {
    $(".menu-cont").removeClass("d-flex").addClass("d-none")
  } else {
    isMenuOpen = true
  }
}



