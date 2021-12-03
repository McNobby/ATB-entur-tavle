import styles from "../styles/Home.module.css";
import createEnturService from "@entur/sdk";
import { useEffect, useState } from "react";

export default function RouteList({ service, routeID, display, limit }) {

	const [data, setData] = useState([]);
    const [stopName, setStopName] = useState('')
    
	const setDepartures = async () => {
		
		let departures = await service.getDeparturesFromStopPlace(
			routeID,
			{ limit }
		);  
		let newData = departures.map(item=>{

			let formattedTime = new Date(item.expectedArrivalTime).toLocaleTimeString(
				navigator.language, {hour: '2-digit', minute:'2-digit'}
			);

			let minuteDiff = (
				new Date(item.expectedArrivalTime).getTime() - Date.now()
			) / (1000*60);

			if (minuteDiff < 10) {
				formattedTime = Math.round(minuteDiff) + " min";
				if (Math.round(minuteDiff) <= 0) formattedTime = "Nå";
			}

			// if (item.destinationDisplay.frontText !== display) return;

			return {
				time: formattedTime,
				display: (!display && ` - ${item.destinationDisplay.frontText}`),
				id: item.serviceJourney.id,
                quay: item.quay.publicCode
			}
		});

		setData(newData);//.filter(e=>e));
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
		let intervalId = setInterval(setDepartures, 5000);
        
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
				    	{el.time}{el.display}
				    </h3>
                    <p>{el.quay && `(Stopp ${el.quay})`}</p>
                </div>
			))}
		</div>
	)
}