import styles from "../styles/Home.module.scss";
import createEnturService from "@entur/sdk";
import { useEffect, useState } from "react";
import RouteList from "../../components/RouteList";
import { useRouter } from "next/router";

export default function Home() {

	const router = useRouter();

	const [stops, setStops] = useState([])

	const service = createEnturService({ clientName: 'chaIM-customtavle' });

	useEffect(() => {
		//if there is no saved stops in browser get user to define the stops
		const stops = localStorage.getItem("stops")
		if(!stops || stops === "[]") router.push("/edit");

		setStops(JSON.parse(stops))
	}, []);

	//to find stopplace id visit: https://stoppested.entur.org/ 
	return (
		<div className={styles.mainPage}>
			{stops && stops.map(e => (
				<RouteList service={service} routeID={e.id} limit={10} key={e} />
			))}
		</div>
	);
}
