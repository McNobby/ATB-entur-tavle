import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import createEnturService from "@entur/sdk";
import RouteList from "../components/RouteList";
import styles from "../styles/Home.module.css";

export default function Stops() {

	const router = useRouter();
	const [stops, setStops] = useState([]);
	const service = createEnturService({ clientName: 'chaIM-customtavle' });

	useEffect(()=>{

		if (!router.isReady) return;
		setStops(router.query.stops.split(";"));

	}, [router.isReady]);

	return (
		<div className={styles.mainPage}>
      		{stops.map(stop=>(
        		<RouteList
					service={service}
					routeID={`NSR:StopPlace:${stop}`}
					limit={10}
					key={stop}
				/>
      		))}
		</div>
	)

}