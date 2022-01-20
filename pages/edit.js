import {useState, useEffect} from 'react'
import createEnturService from "@entur/sdk";
import styles from "../styles/Home.module.scss";
import { useRouter } from 'next/router';
const service = createEnturService({ clientName: 'chaIM-customtavle' });

const SetStops = () => {

	const router = useRouter();
	
	const [stopList, setStopList] = useState([])
	const [autoComplete, setAutoComplete] = useState([])
	const [showSearch, setShowSearch] = useState(false)
	const [selectedSearch, setSelectedSearch] = useState({})

	// gets the stops saved in localstorage
	const getStopList = async () => {
		const stops = localStorage.getItem("stops")
			
		// if localstorage is empty
		if(!stops) return
		// saves in state
		stops = JSON.parse(stops)
		setStopList(stops)
	}

	useEffect(getStopList, []);

	const deleteStop = index => {
		// removes the selected stop and saves the new array in state
		const newStopList = stopList.filter((_, i) => i !== index);
		setStopList(newStopList);
		localStorage.setItem("stops", JSON.stringify(newStopList));
	}
	
	//this maps the stops into a list
	const list = stopList.map((value, index) => (
		<div className={styles.stop} key={value.id}>
			<h2>{value.name}</h2>
			<p>{value.id}</p>
			<button onClick={()=>{ deleteStop(index) }} value={value.id}>Slett</button>
		</div>
	))

	const onSearchTyping = async e => {

		setShowSearch(true)
		//gets autocomplete from entur api
		try {
			const autocomplete = await service.geocoder.autocomplete({
				text: e.target.value,
				layers: "venue" //spesifiec only buss stops
			})
			setAutoComplete(autocomplete.features)//saves current suggestions in state
		}
		catch {
			setAutoComplete([]) //if there is no stops found
			setShowSearch(false)
		}
	}

	const selectStop = item => {
		setSelectedSearch(item.properties)
		setShowSearch(false);
	}

	//this maps the autocomplete list
	const autoCompleteList = autoComplete.map(i => (
		<div className={styles.item} key={i.properties.id} onClick={()=>{ selectStop(i) }}>
			<h4>{i.properties.name}</h4>
			<p>({i.properties.county}, {i.properties.locality})</p>
		</div>
	));

	const DisplaySelectedSearch = () => {
		const click = () => {
			//if there is no selected search
			if(!selectedSearch.label) return;
			if(!stopList) {
				const newStopList = JSON.stringify([{id: selectedSearch.id, name: selectedSearch.label}])
				localStorage.setItem("stops", newStopList)
				setSelectedSearch([])
				getStopList()
				return
			}
			const newStopList = [...stopList, {id: selectedSearch.id, name: selectedSearch.label}]
			localStorage.setItem("stops", JSON.stringify(newStopList))
			getStopList()
			setSelectedSearch([])
		}
		return (
			<div className={styles.selected}>
				<h1>{selectedSearch.label}</h1>
				<h2>{selectedSearch.county}</h2>
				<p>{selectedSearch.id}</p>
				<button onClick={click}>Legg til</button>
			</div>
		)
	}

	const exit = () => {
		router.push("/");
	}
	return (
		<div className={styles.mainPage}>
			<div className={styles.editCard}>
				<h1>Rediger tavle</h1>
				<div className={styles.options}>
					<div className={styles.option}>
						<div className={styles.wrap}>
							<h1>Søkefelt</h1>
							<input type="text" className={styles.search}
							onChange={onSearchTyping} 
							onFocus={()=>{ setShowSearch(true) }}
							/>
							<div className={showSearch ? styles.autocomplete : styles.hidden}>
								{autoCompleteList}
							</div>
						</div>
						<DisplaySelectedSearch />
					</div>

					<div className={styles.option}>
						<div className={styles.wrap}>
							<h1>Selected stops</h1>
							{list}
							<button className={styles.homeBtn} onClick={exit} >Hjem</button>
						</div>
					
					</div>
				</div>
			</div>
		</div>
	)
}

export default SetStops
