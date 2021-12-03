import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";

export default function RouteList({ service, routeID, limit }) {

	const [data, setData] = useState([]);
    const [stopName, setStopName] = useState('');
    
	const setDepartures = async () => {
		
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

			// relative arrival time
			if (minuteDiff < 10) {
				formattedTime = Math.round(minuteDiff) + " min";
				if (Math.round(minuteDiff) <= 0) formattedTime = "Nå";
			}

			return {
				time: formattedTime,
				display: item.destinationDisplay.frontText,
				id: item.serviceJourney.id,
                quay: item.quay.publicCode
			}
		}));
	}

    const getStopName = async () => {
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

    const textColor = (time) => {

        if(time.startsWith('Nå')){
            return(
                {color:"#ebc354"}
            )
        }

        if(time[2] !== 'm'){
            return
        }

        if(parseInt(time[0]) < 6){
            return(
                {color:"#ebc354"}
            )
        }
    }

	return (
		<div className={styles.timeTable}>
            <h2>{stopName}</h2>
			{data.map(el=>(
                <div className={styles.time} key={el.id} style={textColor(el.time)} >
				    <h3 >
				    	{el.time} - {el.display}
				    </h3>
                    <p>{el.quay && `(Stopp ${el.quay})`}</p>
                </div>
			))}
		</div>
	)
}