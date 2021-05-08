
function addList() {

    var giturl = $('.git-input').val();
  
  
    if (validURL(giturl) && giturl.includes("releases.atom") && giturl.includes("github.com")) {
      var feed = "https://gitcors.herokuapp.com/" + giturl;
  
      $.get(feed, function (data) {
        console.log($(data).find("id").text())
        var el = $(data).find("entry")[0];
        console.log("------------------------");
        console.log("title      : " + $(el).find("title").text());
        console.log("author     : " + $(el).find("author").text());
        console.log("description: " + $(el).find("description").text());
        console.log("description: " + $(el).find("updated").text());
  
      });
    }
    else {
      console.log("not epic")
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
  