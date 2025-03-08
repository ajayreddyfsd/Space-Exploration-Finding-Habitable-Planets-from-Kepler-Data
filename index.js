//importing necessary modules and packages
const fs = require("fs");
const { parse } = require("csv-parse");

//function returning a promise. why? coz it needs to return one of two values based on an async operation
function loadPlanets() {
  let planets = [];

  //the usual csv reading code, reading as streams
  return new Promise((resolve, reject) => {
    fs.createReadStream("kepler_data.csv")
      .pipe(parse({ columns: true, trim: true, from_line: 145 }))
      .on("data", (row) => {
        planets.push(row);
      })
      .on("end", () => {
        resolve(planets); //resolve returns one value
      })
      .on("error", (err) => {
        reject(err); //and reject returns one value
      });
  });
}

async function coreLogic() {
  //though loadPlanets returns promise, since we are using await, it
  //assigns the resolved value to planets rather than promise.
  //if not using await, need to use .then()
  let planets = await loadPlanets();

  // filtering habitable planets based on conditions determined by NASA
  habitable_planets = [];
  for (let planet of planets) {
    if (
      planet.koi_disposition === "CONFIRMED" &&
      planet.koi_insol > 0.36 &&
      planet.koi_insol < 1.11 &&
      planet.koi_prad < 1.6
    ) {
      habitable_planets.push(planet);
    }
  }

  console.log(`total planets = ${planets.length}`);
  console.log(`habitable planets = ${habitable_planets.length}`);
  console.log(
    `percentage = ${((habitable_planets.length * 100) / planets.length).toFixed(
      3
    )} %`
  );
}

coreLogic();
