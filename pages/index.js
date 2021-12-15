import styles from "../styles/Home.module.scss";
import createEnturService from "@entur/sdk";
import { useEffect, useState } from "react";
import RouteList from "../components/RouteList";

export default function Home() {

  const [stops, setStops] = useState([])

	const service = createEnturService({ clientName: 'chaIM-customtavle' });

useEffect(()=> {
	if(!localStorage.getItem("stops")) { //if there is no saved stops in browser get user to define the stops
    let savedStops = []
    //temporary for loop function that prompts user to add max 3 stop id's. saves the id's in local storage
    for (let i = 0; i < 3; i++) {
      let stop = prompt("sett inn NSR id for stoppplasser (https://stoppested.entur.org/) skriv ferdig om du er ferdig")
      if(stop.toLowerCase() === 'ferdig'){
        break
      }
      savedStops.push(`NSR:StopPlace:${stop}`)
    }

		localStorage.setItem("stops", JSON.stringify(savedStops))
	}

  const stopsInBrowser = JSON.parse(localStorage.getItem("stops"))
  setStops(stopsInBrowser)
},[])

//to find stopplace id visit: https://stoppested.entur.org/ 
	return (
		<div className={styles.mainPage}>
      {stops.map(e=>(
        <RouteList service={service} routeID={e} limit={10} key={e} />
      ))}
		</div>
	)
}