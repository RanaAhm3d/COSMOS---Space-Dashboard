// WRITE YOUR JS CODE HERE
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".app-section");

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const target = link.dataset.section;
    sections.forEach((sec) => {
      sec.classList.add("hidden");
    });

    const sectionToShow = document.querySelector(
      `.app-section[data-section="${target}"]`
    );
    if (sectionToShow) {
      sectionToShow.classList.remove("hidden");
    }

    navLinks.forEach((l) => {
      l.classList.remove("bg-blue-500/10", "text-blue-400");
      l.classList.add("text-slate-300");
    });

    link.classList.add("bg-blue-500/10", "text-blue-400");
    link.classList.remove("text-slate-300");
  });
});

const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebar-toggle");
const sidebarOverlay = document.querySelector(".sidebar-overlay");

sidebarToggle.addEventListener("click", () => {
  sidebar.classList.add("sidebar-open");
  sidebarOverlay.classList.remove("hidden");
});

navLinks.forEach((nav) => {
  nav.addEventListener("click", () => {
    sidebar.classList.remove("sidebar-open");
    sidebarOverlay.classList.add("hidden");
  });
});

document.addEventListener("click", (e) => {
  if (e.target === sidebarOverlay) {
    sidebar.classList.remove("sidebar-open");
    sidebarOverlay.classList.add("hidden");
  }
});

var searchDate = document.getElementById("apod-date-input");
const loadBtn = document.getElementById("load-date-btn");
const viewFullResBtn = document.querySelector(".viewFullResBtn");
const calendarDate = document.querySelector(".calendarDate");
const todayApodBtn = document.getElementById("today-apod-btn");

todayApodBtn.addEventListener("click", () => {
  SetSearchInputText();
  searchDate.value = today;
  getTodaysAPOD();
});

var today = new Date().toISOString().split("T")[0];
searchDate.setAttribute("max", today);
var formattedDate = new Date().toLocaleDateString("en-US", {
  month: "long",
  day: "2-digit",
  year: "numeric",
});

SetSearchInputText();

function SetSearchInputText() {
  const date = new Date(today);
  searchDate.nextElementSibling.innerHTML = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

viewFullResBtn.addEventListener("click", () => {
  window.open(document.getElementById("apod-image").src, "_blank");
});

loadBtn.addEventListener("click", () => {
  getTodaysAPOD(searchDate.value);
});

searchDate.addEventListener("change", () => {
  const date = new Date(searchDate.value);
  searchDate.nextElementSibling.innerHTML = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
});

async function getTodaysAPOD(searchDate = today) {
  const img = document.getElementById("apod-image");
  const loader = document.getElementById("apod-loading");
  try {
    loader.classList.remove("hidden");
    img.classList.add("hidden");
    var response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=LZNaQ2hPKncSq3stexxNTg3gkmuw7tHa67raCx9Z&date=${searchDate}`
    );
    var data = await response.json();
    const dataDate = new Date(data.date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    document.getElementById(
      "apod-date"
    ).textContent = `Astronomy Picture of the Day - ${
      dataDate || formattedDate
    }`;
    img.onload = () => {
      loader.classList.add("hidden");
      img.classList.remove("hidden");
    };

    img.src = data.url;
    document.getElementById("apod-title").textContent = data.title;
    document.getElementById("apod-date-detail").textContent = data.date;
    document.getElementById("apod-explanation").textContent = data.explanation;
    document.getElementById(
      "apod-copyright"
    ).innerHTML = ` <i class="fa-solid fa-copyright"></i>
  Copyright: ${data.copyright}`;
    document.getElementById("apod-date-info").textContent = formattedDate;
    document.getElementById("apod-media-type").textContent = data.media_type;
  } catch (error) {
    loader.classList.remove("hidden");
    img.classList.add("hidden");
    loader.innerHTML = `
            <i class="text-4xl text-red-400 mb-4" data-fa-i2svg=""><svg class="svg-inline--fa fa-triangle-exclamation" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="triangle-exclamation" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"></path></svg></i>
            <p class="text-slate-400">Failed to load today's image</p>
            <p class="text-slate-500 text-sm mt-2">Please try again later</p>
    `;
  }
}

async function getLanches() {
  try {
    var response = await fetch(
      "https://lldev.thespacedevs.com/2.3.0/launches/upcoming/?limit=10"
    );
    var response = await response.json();
    var data = response.results;
    var featuredLaunch = document.getElementById("featured-launch");
    var launchesGrid = document.getElementById("launches-grid");
    const net = new Date(data[0].net);

    const date = net.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const now = new Date();
    const diffTime = net - now;
    const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const time = net
      .toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "UTC",
      })
      .replace("am", "AM")
      .replace("pm", "PM");

    const statusColor = {
      Go: "green",
      Success: "green",
      TBD: "yellow",
      Hold: "red",
      TBC: "yellow",
    };

    featuredLaunch.innerHTML += `
                    <div
              class="relative bg-slate-800/30 border border-slate-700 rounded-3xl overflow-hidden group hover:border-blue-500/50 transition-all"
            >
              <div
                class="absolute inset-0 bg-linear-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
              ></div>
              <div class="relative grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
                <div class="flex flex-col justify-between">
                  <div>
                    <div class="flex items-center gap-3 mb-4">
                      <span
                        class="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold flex items-center gap-2"
                      >
                        <i class="fas fa-star"></i>
                        Featured Launch
                      </span>
                      <span
                        class="px-4 py-1.5 bg-${
                          statusColor[data[0].status.abbrev]
                        }-500/20 text-${
      statusColor[data[0].status.abbrev]
    }-400 rounded-full text-sm font-semibold"
                      >
                        ${data[0].status.abbrev}
                      </span>
                    </div>
                    <h3 class="text-3xl font-bold mb-3 leading-tight">
                      ${data[0].name}
                    </h3>
                    <div
                      class="flex flex-col xl:flex-row xl:items-center gap-4 mb-6 text-slate-400"
                    >
                      <div class="flex items-center gap-2">
                        <i class="fas fa-building"></i>
                        <span>${data[0].launch_service_provider.name}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <i class="fas fa-rocket"></i>
                        <span>${data[0].rocket.configuration.name}</span>
                      </div>
                    </div>
                    <div
                      class="inline-flex items-center gap-3 px-6 py-3 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-xl mb-6"
                    >
                      <i class="fas fa-clock text-2xl text-blue-400"></i>
                      <div>
                        <p class="text-2xl font-bold text-blue-400">${daysUntil}</p>
                        <p class="text-xs text-slate-400">Days Until Launch</p>
                      </div>
                    </div>
                    <div class="grid xl:grid-cols-2 gap-4 mb-6">
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                        >
                          <i class="fas fa-calendar"></i>
                          Launch Date
                        </p>
                        <p class="font-semibold">${date}</p>
                      </div>
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                        >
                          <i class="fas fa-clock"></i>
                          Launch Time
                        </p>
                        <p class="font-semibold">${time} UTC</p>
                      </div>
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                        >
                          <i class="fas fa-map-marker-alt"></i>
                          Location
                        </p>
                        <p class="font-semibold text-sm">${
                          data[0].pad.location.name
                        }</p>
                      </div>
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                        >
                          <i class="fas fa-globe"></i>
                          Country
                        </p>
                        <p class="font-semibold">${data[0].pad.country.name}</p>
                      </div>
                    </div>
                    <p class="text-slate-300 leading-relaxed mb-6">
                      ${data[0].mission.description}
                    </p>
                  </div>
                  <div class="flex flex-col md:flex-row gap-3">
                    <button
                      class="flex-1 self-start md:self-center px-6 py-3 bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      <i class="fas fa-info-circle"></i>
                      View Full Details
                    </button>
                    <div class="icons self-end md:self-center">
                      <button
                        class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors"
                      >
                        <i class="far fa-heart"></i>
                      </button>
                      <button
                        class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors"
                      >
                        <i class="fas fa-bell"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="relative">
                  <div
                    class="relative h-full min-h-[400px] rounded-2xl overflow-hidden bg-slate-900/50"
                  >
                    <img
                      src="${data[0].image.image_url}"
                      alt="${data[0].name}"
                      class="w-full h-full object-cover"
                    />
                    <div
                      class="flex items-center justify-center h-full min-h-[400px] bg-slate-800"
                    >
                      <i class="fas fa-rocket text-9xl text-slate-700/50"></i>
                    </div>
                    <div
                      class="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
        `;
    launchesGrid.innerHTML = ``;
    for (let i = 1; i < data.length; i++) {
      const net = new Date(data[i].net);

      const date = net.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });

      const time = net
        .toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZone: "UTC",
        })
        .replace("am", "AM")
        .replace("pm", "PM");
      launchesGrid.innerHTML += `<div
              class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer"
            >
              <div
                class="relative h-48 bg-slate-900/50 flex items-center justify-center"
              >
              <img
        src="${data[i].image.image_url}"
        alt="${data[i].name}"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        onerror="this.onerror=null; this.src='assets/images/launch-placeholder.png';"
            />
                <div class="absolute top-3 right-3">
                  <span
                    class="px-3 py-1 bg-green-500/90 text-white backdrop-blur-sm rounded-full text-xs font-semibold"
                  >
                    ${data[i].status.abbrev}
                  </span>
                </div>
              </div>
              <div class="p-5">
                <div class="mb-3">
                  <h4
                    class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors"
                  >
                    ${data[i].name}
                  </h4>
                  <p class="text-sm text-slate-400 flex items-center gap-2">
                    <i class="fas fa-building text-xs"></i>
                    ${data[i].launch_service_provider.name}
                  </p>
                </div>
                <div class="space-y-2 mb-4">
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-calendar text-slate-500 w-4"></i>
                    <span class="text-slate-300">${date}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-clock text-slate-500 w-4"></i>
                    <span class="text-slate-300">${time} UTC</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-rocket text-slate-500 w-4"></i>
                    <span class="text-slate-300">${data[i].rocket.configuration.name}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-map-marker-alt text-slate-500 w-4"></i>
                    <span class="text-slate-300 line-clamp-1">${data[i].pad.location.name}</span>
                  </div>
                </div>
                <div
                  class="flex items-center gap-2 pt-4 border-t border-slate-700"
                >
                  <button
                    class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold"
                  >
                    Details
                  </button>
                  <button
                    class="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    <i class="far fa-heart"></i>
                  </button>
                </div>
              </div>
            </div>`;
    }
  } catch (error) {
    console.log(error);
  }
}

const planetColor = {
  mercure: "#eab308",
  venus: "#f97316",
  terre: "#3b82f6",
  mars: "#ef4444",
  jupiter: "#fb923c",
  saturne: "#facc15",
  uranus: "#06b6d4",
  neptune: "#2563eb",
};
const planetImage = {
  mercure: "assets/images/mercury.png",
  venus: "assets/images/venus.png",
  terre: "assets/images/earth.png",
  mars: "assets/images/mars.png",
  jupiter: "assets/images/jupiter.png",
  saturne: "assets/images/saturn.png",
  uranus: "assets/images/uranus.png",
  neptune: "assets/images/neptune.png",
};
const typeBgColor = {
  "Ice Giant": "#3b82f680",
  "Gas Giant": "#a855f780",
  Terrestrial: "#f9731680",
};
const typeColor = {
  "Ice Giant": "#60a5fa",
  "Gas Giant": "#c084fc",
  Terrestrial: "#fb923c",
};

async function getAllPlanets() {
  try {
    var response = await fetch(
      "https://solar-system-opendata-proxy.vercel.app/api/planets"
    );
    var response = await response.json();
    var planets = response.bodies;
    var planetsGrid = document.getElementById("planets-grid");
    for (let i = 0; i < planets.length; i++) {
      const distance = (planets[i].semimajorAxis / 1495978707e-1).toFixed(2);
      planetsGrid.innerHTML += `
                  <div
              class="planet-card bg-slate-800/50 border border-slate-700 rounded-2xl p-4 transition-all cursor-pointer group"
              data-planet-id="${planets[i].id}"
              style="--planet-color: ${planetColor[planets[i].id]}"
              onmouseover="this.style.borderColor='${
                planetColor[planets[i].id]
              }80'"
              onmouseout="this.style.borderColor='#334155'"
            >
              <div class="relative mb-3 h-24 flex items-center justify-center">
                <img
                  class="w-20 h-20 object-contain group-hover:scale-110 transition-transform"
                  src="${planetImage[planets[i].id]}"
                  alt="${planets[i].name}"
                />
              </div>
              <h4 class="font-semibold text-center text-sm">${
                planets[i].englishName
              }</h4>
              <p class="text-xs text-slate-400 text-center">${distance} AU</p>
            </div>
      `;
    }
    var planetComparison = document.getElementById("planet-comparison-tbody");
    function formatOrbitalPeriod(days) {
      if (days < 365) {
        return `${days.toFixed(0)} days`;
      } else {
        const years = days / 365.25;
        return `${years.toFixed(1)} years`;
      }
    }
    for (let i = 0; i < planets.length; i++) {
      const distance = (planets[i].semimajorAxis / 1495978707e-1).toFixed(2);
      planetComparison.innerHTML += `
                          <tr class="hover:bg-slate-800/30 transition-colors">
                      <td
                        class="px-4 md:px-6 py-3 md:py-4 sticky left-0 bg-slate-800 z-10"
                      >
                        <div class="flex items-center space-x-2 md:space-x-3">
                          <div
                            class="w-6 h-6 md:w-8 md:h-8 rounded-full flex-shrink-0"
                            style="background-color: ${
                              planetColor[planets[i].id]
                            }"
                          ></div>
                          <span
                            class="font-semibold text-sm md:text-base whitespace-nowrap"
                            >${planets[i].englishName}</span
                          >
                        </div>
                      </td>
                      <td
                        class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap"
                      >
                        ${distance}
                      </td>
                      <td
                        class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap"
                      >
                        ${parseInt(
                          (planets[i].meanRadius * 2).toFixed(0)
                        ).toLocaleString()}
                      </td>
                      <td
                        class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap"
                      >
                        ${(
                          (planets[i].mass.massValue *
                            Math.pow(10, planets[i].mass.massExponent)) /
                          5.972e24
                        ).toFixed(3)}
                      </td>
                      <td
                        class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap"
                      >
                        ${formatOrbitalPeriod(planets[i].sideralOrbit)}
                      </td>
                      <td
                        class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap"
                      >
                        ${planets[i].moons ? planets[i].moons.length : 0}
                      </td>
                      <td class="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                        <span
                          class="px-2 py-1 rounded text-xs "
                          style="background-color: ${
                            typeBgColor[planets[i].type.toLocaleString()]
                          }; color: ${
        typeColor[planets[i].type.toLocaleString()]
      }"
                          >${planets[i].type}</span
                        >
                      </td>
                    </tr>
      `;
    }
    choosePlanet(planets);
  } catch (error) {
    planetsGrid.innerHTML = `<div class="col-span-full text-center py-8">
                    <i class="text-red-400 text-4xl mb-4" data-fa-i2svg=""><svg class="svg-inline--fa fa-triangle-exclamation" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="triangle-exclamation" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"></path></svg></i>
                    <p class="text-slate-400">Failed to load planets data. Please try again later.</p>
                </div>`;
  }
}

function updatePlanet(planet) {
  document.getElementById("planet-detail-image").src =
    planetImage[planet.id] || "assets/images/earth.png";
  document.getElementById("planet-detail-name").textContent =
    planet.englishName;
  document.getElementById("planet-detail-description").textContent =
    planet.description;
  document.getElementById("planet-distance").textContent =
    (planet.semimajorAxis / 1e6).toFixed(1) + "M km";
  document.getElementById("planet-radius").textContent =
    planet.meanRadius.toFixed(0) + " km";
  document.getElementById(
    "planet-mass"
  ).textContent = `${planet.mass.massValue} × 10^${planet.mass.massExponent} kg`;

  document.getElementById("planet-density").textContent =
    planet.density.toFixed(2) + " g/cm³";

  document.getElementById("planet-orbital-period").textContent =
    planet.sideralOrbit.toFixed(2) + " days";
  document.getElementById("planet-rotation").textContent =
    planet.sideralRotation.toFixed(2) + " hours";
  document.getElementById("planet-moons").textContent = planet.moons
    ? planet.moons.length
    : 0;
  document.getElementById("planet-gravity").textContent =
    planet.gravity.toFixed(2) + " m/s²";

  document.getElementById("planet-discoverer").textContent =
    planet.discoveredBy || "Known since antiquity";
  document.getElementById("planet-discovery-date").textContent =
    planet.discoveryDate || "Ancient times";
  document.getElementById("planet-body-type").textContent =
    planet.bodyType || "Planet";
  document.getElementById(
    "planet-volume"
  ).textContent = `${planet.vol.volValue} × 10^${planet.vol.volExponent} km³`;

  document.getElementById(
    "planet-facts"
  ).innerHTML = `<li class="flex items-start">
                <i class="text-green-400 mt-1 mr-2" data-fa-i2svg=""><svg class="svg-inline--fa fa-check" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"></path></svg></i>
                <span class="text-slate-300">Mass: ${
                  planet.mass.massValue
                } × 10^${planet.mass.massExponent} kg</span>
            </li>
            <li class="flex items-start">
                <i class="text-green-400 mt-1 mr-2" data-fa-i2svg=""><svg class="svg-inline--fa fa-check" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"></path></svg></i>
                <span class="text-slate-300">Surface gravity: ${planet.gravity.toFixed(
                  2
                )} m/s²
                </span>
            </li>
            <li class="flex items-start">
                <i class="text-green-400 mt-1 mr-2" data-fa-i2svg=""><svg class="svg-inline--fa fa-check" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"></path></svg></i>
                <span class="text-slate-300">Density: ${planet.density.toFixed(
                  2
                )} g/cm³
                </span>
            </li>
            <li class="flex items-start">
                <i class="text-green-400 mt-1 mr-2" data-fa-i2svg=""><svg class="svg-inline--fa fa-check" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"></path></svg></i>
                <span class="text-slate-300">Axial tilt: ${
                  planet.axialTilt
                }°</span>
            </li>`;
  document.getElementById("planet-perihelion").textContent = `${(
    planet.perihelion / 1e6
  ).toFixed(1)}M km`;

  document.getElementById("planet-aphelion").textContent = `${(
    planet.aphelion / 1e6
  ).toFixed(1)}M km`;

  document.getElementById("planet-eccentricity").textContent =
    planet.eccentricity.toFixed(5);
  document.getElementById(
    "planet-inclination"
  ).textContent = `${planet.inclination.toFixed(2)}°`;

  document.getElementById(
    "planet-axial-tilt"
  ).textContent = `${planet.axialTilt.toFixed(2)}°`;

  document.getElementById("planet-temp").textContent = `${planet.avgTemp}°C`;

  document.getElementById("planet-escape").textContent = `${(
    planet.escape / 1e3
  ).toFixed(2)} km/s`;
}

function choosePlanet(planets) {
  document.querySelectorAll(".planet-card").forEach((card) => {
    card.addEventListener("click", () => {
      const planetId = card.dataset.planetId;
      const planet = planets.find((planet) => planet.id === planetId);
      if (planet) {
        updatePlanet(planet);
      }
    });
  });
}

async function fire() {
  await Promise.all([getTodaysAPOD(), getLanches(), getAllPlanets()]);
}

fire();
