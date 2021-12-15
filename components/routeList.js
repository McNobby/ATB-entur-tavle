import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";

export default function RouteList({ service, routeID, limit }) {

	const [data, setData] = useState([]);
    const [stopName, setStopName] = useState('');
    
	//this function runs every 5 seconds. Is called in the useEffect hook
	//this function gets time tables for a selected stop by NSR ID
	const setDepartures = async () => {
		//fetches from entur api
		let departures = await service.getDeparturesFromStopPlace(
			routeID,
			{ limit }
		);

		setData(departures.map(item=>{

			// format time to hh:mm
			let formattedTime = new Date(item.expectedArrivalTime).toLocaleTimeString(
				navigator.language, {hour: '2-digit', minute:'2-digit'}
			);

			// difference between now and bus arrival time
			let minuteDiff = (
				new Date(item.expectedArrivalTime).getTime() - Date.now()
			) / (1000*60);

			// if arrival time is under 10 minutes, show remaining time in minutes
			if (minuteDiff < 10) {
				formattedTime = Math.round(minuteDiff) + " min";
				//if estimated arrival is in under half a minute, display time left as now
				if (Math.round(minuteDiff) <= 0) formattedTime = "Nå";
			}
			//info to set in data state for displaying in the list
			return {
				time: formattedTime,
				display: item.destinationDisplay.frontText,
				id: item.serviceJourney.id,
                quay: item.quay.publicCode
			}
		}));
	}
	//this runs when the component loads (called in use effect hook )
	//it gets the stopname of the selected stop by NSR ID
    const getStopName = async () => {
		//fetches from entur api
        const stopPlace = await service.nsr.getStopPlace(
            routeID,
        )
        setStopName(stopPlace.name.value)
    }

	useEffect(()=>{
        getStopName();
		setDepartures();
		// update departures per 5 sec
		let intervalId = setInterval(setDepartures, 5000);
		// free interval
		return () => { clearInterval(intervalId) };

	}, []);

	//this function returns a css value making text yellow if its five minutes or less left to arrival
    const textColor = (time) => {
		//if the time starts with nå(norwegian for now) the color should be yellow
        if(time.startsWith('Nå')){
            return(
                {color:"#ebc354"}
            )
        }
		//this is expected to be true if it says x min left and not just arrival time
        if(time[2] !== 'm'){
            return
        }
		//this checks if its five minutes or less left, indicating that the estimated arrival is soon
        if(parseInt(time[0]) < 6){
            return(
                {color:"#ebc354"}
            )
        }
    }

	const timeList = data.map(el => {
		return(
				<div className={styles.time} key={el.id} style={textColor(el.time)} >
				    <h3 >
				    	{el.time} - {el.display}
				    </h3>
                    <p>{el.quay && `(Stopp ${el.quay})`}</p>
                </div>
			)
		})

			
	return (
		<div className={styles.timeTable}>
            <h2>{stopName}</h2>
			{timeList}
		</div>
	)
}