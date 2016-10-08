define(['jquery', 'api', 'event', 'astro'],
function($, FAPI, FEVENT, ASTRO) {

  var placeTime = new ASTRO.PlaceTime();
  var stars = {};
  var starsLoaded = $.Deferred();

  function init() {
    FAPI.starsGET().then(function(data) {
      data.forEach(function(v, i) {
        stars[v.hid] = new ASTRO.Star(v);
      });
    }).done(function() {
      starsLoaded.resolve(stars);
    });
  }

  function getCelestialSphereRot() {
    return placeTime.celestialSphereRotation();
  }

  function getNumberStars() {
    return Object.keys(stars).length;
  }

  function getFocusAltAz() {
    return {az: focus.az, alt: focus.alt};
  }

  function getSunAltAz() {
    var sunPos = placeTime.sunPosition();
    return sunPos.toAltAz(placeTime);
  }

  function getStar(hid) {
    return stars[hid];
  }

  function getConstellation(name) {
    return constellations[name];
  }

  function eachStar(f) {
    for (var prop in stars) {
      if (stars.hasOwnProperty(prop)) {
        f(stars[prop]); 
      } 
    }
  }

  return {
    init: init,
    starsLoaded: starsLoaded,

    getCelestialSphereRot: getCelestialSphereRot,
    getNumberStars: getNumberStars,
    getSunAltAz: getSunAltAz,
    getFocusAltAz: getFocusAltAz,
    getStar: getStar,

    eachStar: eachStar,

    get latitude() {
      return placeTime.latitude;
    },
    set latitude(latitude) {
      placeTime.latitude = latitude;
      FEVENT.fire('placetime');
    },
    get longitude() {
      return placeTime.longitude;
    },
    set longitude(longitude) {
      placeTime.longitude = longitude;
      FEVENT.fire('placetime');
    },
    get time() {
      return placeTime.date;
    },
    set time(time) {
      placeTime.date = time;
      FEVENT.fire('placetime');
    }
  };
});
