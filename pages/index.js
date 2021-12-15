import styles from "../styles/Home.module.scss";
import createEnturService from "@entur/sdk";
import { useEffect, useState } from "react";
import RouteList from "../components/RouteList";

export default function Home() {

  const [stops, setStops] = useState([])

	const service = createEnturService({ clientName: 'chaIM-customtavle' });

useEffect(()=> {
	if(!localStorage.getItem("stops")) { //if there is no saved stops in browser get user to define the stops
    window.location.href = "/edit"
	}

  const stopsInBrowser = JSON.parse(localStorage.getItem("stops"))
  setStops(stopsInBrowser)
},[])

//to find stopplace id visit: https://stoppested.entur.org/ 
	return (
		<div className={styles.mainPage}>
      {stops.map(e=>(
        <RouteList service={service} routeID={e.id} limit={10} key={e} />
      ))}
		</div>
	)
}