function loadPlaces(position) {
  const params = {
    radius: 300,
    clientId: "QDNA0P3IIYCIAIBVMGJV0KZW2PJ0GOXWXYMFI0ZNETLY02PK",
    clientSecret: "L245SRTDZD4TCYOW1X2QTNTJDB2LKUTUJAU0TRZCKYUC4ACK",
    version: "20300101",
  };
  const corsProxy = "*";

  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: "fsq3FdIcp1zi64g5XS7kqnQ3e158xFXYf8BFtn288VVJIag=",
    },
  };
  const api2 = `https://discover.search.hereapi.com/v1/discover?in=circle:${position.latitude},${position.longitude};r=500&q=busstop&apiKey=Xrq1qcW615KRibUxnIgzP8TCDbUQBIwskDIMx_sUIDs`;
  const endpoint = `https://api.foursquare.com/v3/places/search?
    ll=${position.latitude},${position.longitude}
        &radius=${params.radius}
        &limit=30`;

  return fetch(api2)
    .then((res) => {
      return res.json().then((resp) => {
        return resp;
      });
    })
    .catch((err) => {
      console.error("Error with places API", err);
    });
}

window.onload = () => {
  const scene = document.querySelector("a-scene");

  return navigator.geolocation.getCurrentPosition(
    function (position) {
      console.log(position);

      loadPlaces(position.coords).then((places) => {
        console.log(places);
        places.items?.forEach((place) => {
          const latitude = place.position.lat;
          const longitude = place.position.lng;
          const placeText = document.createElement("a-link");
          placeText.setAttribute(
            "gps-entity-place",
            `latitude: ${latitude}; longitude: ${longitude};`
          );
          placeText.setAttribute("title", place.title);
          placeText.setAttribute("src", "assets/icon.svg");
          placeText.setAttribute("scale", "15 15 15");
          placeText.setAttribute("class", "democlass");

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
          placeText.addEventListener("click", clickListener);
          placeText.click("click", clickListener);

          placeText.addEventListener("loaded", () => {
            window.dispatchEvent(new CustomEvent("gps-entity-place-loaded"));
          });

          scene.appendChild(placeText);
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
