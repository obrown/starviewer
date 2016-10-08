define(['jquery'],
function($) {
  var urls = {
    stars: "data/stars.json"
  };

  var starsGET = function() { return $.getJSON(urls.stars); };

  return {
    starsGET: starsGET
  };
});
