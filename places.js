const loadPlaces = function (coords) {
  const endpoint = `https://discover.search.hereapi.com/v1/discover?in=circle:${coords.latitude},${coords.longitude};r=500&q=busstop&apiKey=Xrq1qcW615KRibUxnIgzP8TCDbUQBIwskDIMx_sUIDs`;
  return fetch(endpoint)
    .then((res) => {
      return res.json().then((resp) => {
        console.log(resp);
        return resp.items;
      });
    })
    .catch((err) => {
      console.error("Error with places API", err);
    });
};

window.onload = () => {
  const scene = document.querySelector("a-scene");

  // first get current user location
  return navigator.geolocation.getCurrentPosition(
    function (position) {
      // than use it to load from remote APIs some places nearby
      loadPlaces(position.coords).then((places) => {
        places.forEach((place) => {
          const latitude = place.position.lat;
          const longitude = place.position.lng;
          const url = "https://www.google.com/";
          // add place icon
          const icon = document.createElement("a-image");
          icon.setAttribute(
            "gps-entity-place",
            `latitude: ${latitude}; longitude: ${longitude};`
          );
          icon.setAttribute("name", place.title);
          icon.setAttribute("href", url);
          icon.setAttribute("src", "./assets/map-marker.png");

          // for debug purposes, just show in a bigger scale, otherwise I have to personally go on places...
          icon.setAttribute("scale", "20, 20");

          icon.addEventListener("loaded", () =>
            window.dispatchEvent(new CustomEvent("gps-entity-place-loaded"))
          );

          const clickListener = function (ev) {
            ev.stopPropagation();
            ev.preventDefault();

            const name = ev.target.getAttribute("name");

            const el =
              ev.detail.intersection && ev.detail.intersection.object.el;

            if (el && el === ev.target) {
              const label = document.createElement("span");
              const container = document.createElement("div");
              container.setAttribute("id", "place-label");
              label.innerText = name;
              container.appendChild(label);
              document.body.appendChild(container);

              setTimeout(() => {
                container.parentElement.removeChild(container);
              }, 1500);
            }
          };

          icon.addEventListener("click", clickListener);

          scene.appendChild(icon);
        });
      });
    },
    (err) => console.error("Error in retrieving position", err),
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 27000,
    }
  );
};
