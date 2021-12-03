import styles from "../styles/Home.module.css";
import createEnturService from "@entur/sdk";
import { useEffect, useState } from "react";

export default function RouteList(props) {

    const {service, routeID, limit} = props //destructuring props

	const [data, setData] = useState([]);

	const setDepartures = async () => {
		
		let departures = await service.getDeparturesFromStopPlace(
			routeID,
			{ limit }
		);
        
		setData(departures.map(item=>{

			let formattedTime = new Date(item.expectedArrivalTime).toLocaleTimeString(
				navigator.language, {hour: '2-digit', minute:'2-digit'}
			);

			let minuteDiff = (
				new Date(item.expectedArrivalTime).getTime() - Date.now()
			) / (1000*60);

			if (minuteDiff < 10) {
				formattedTime = Math.round(minuteDiff) + " min";
				if (Math.round(minuteDiff) === 0) formattedTime = "nå";
			}

			return {
				time: formattedTime,
				display: item.destinationDisplay.frontText,
				id: item.serviceJourney.id
			}
		}));
	}

	useEffect(()=>{

		setDepartures();
		let intervalId = setInterval(setDepartures, 5000);

		return () => { clearInterval(intervalId) };

	}, []);

	return (
		<div className={styles.container}>
			{data.map(el=>(
				<p key={el.id}>
					{el.time} - {el.display}
				</p>
			))}
		</div>
	)
}