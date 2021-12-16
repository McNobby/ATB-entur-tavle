import {useState, useEffect} from 'react'
import createEnturService from "@entur/sdk";
import styles from "../styles/Home.module.scss";
const service = createEnturService({ clientName: 'chaIM-customtavle' });

const SetStops = () => {
    
    const [stopList, setStopList] = useState([])
    const [autoComplete, setAutoComplete] = useState([])
    const [showSearch, setShowSearch] = useState(false)
    const [selectedSearch, setSelectedSearch] = useState({})

    useEffect(()=> {
        getStopList()
    },[])

    // gets the stops saved in localstorage
    const getStopList = async () => {
        const stops = localStorage.getItem("stops")
        
        // if localstorage is empty
        if(!stops) return
        // saves in state
        stops = JSON.parse(stops)
        setStopList(stops)
    }
    
    //this maps the stops into a list
    const list = stopList.map(i=> {
        const click = (e) => {//logic for deleting a stop
            // removes the selected stop in a new array
            let newStopList = stopList.filter(e => e.id !== i.id)
            // save the new array in state
            setStopList(newStopList)
            localStorage.setItem("stops", JSON.stringify(newStopList))
        }
        return(
            <div className={styles.stop} key={i.id}>
                <h2>{i.name}</h2>
                <p>{i.id}</p>
                <button onClick={click} value={i.id} >Slett</button>
            </div>
        )
    })

    const inputChange = async (e) => { //when user types
        setShowSearch(true)
        console.log(stopList);
        try{//gets autocomplete from entur api
            const autocomplete = await service.geocoder.autocomplete({
                text: e.target.value,
                layers: "venue" //spesifiec only buss stops
            })
            setAutoComplete(autocomplete.features)//saves current suggestions in state

        }catch(error){
            setAutoComplete([]) //if there is no stops found
            setShowSearch(false)
        }
    }

    //theese two functions essentially toggles between true or false when
    //the search bar is focused and not
    const inputFocus = () => {
        setShowSearch(true)
    }
    const inputBlur = () => {
        setShowSearch(false)
    }

    //this maps the autocomplete list
    const autoCompleteList = autoComplete.map(i=>{
        //when a result is clicked
        const click = () => {
            setSelectedSearch(i.properties)
            inputBlur()
        }
        return(
            <div className={styles.item} key={i.properties.id} onClick={click}>
                <h4>{i.properties.name}</h4>
                <p>({i.properties.county}, {i.properties.locality})</p>
            </div>
        )
    })

    const DisplaySelectedSearch = () => {
        const click = () => {
            //if there is no selected search
            if(!selectedSearch.label){
                return
            }
            if(!stopList){
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
        return(
            <div className={styles.selected}>
                <h1>{selectedSearch.label}</h1>
                <h2>{selectedSearch.county}</h2>
                <p>{selectedSearch.id}</p>
                <button onClick={click}>Legg til</button>
            </div>
        )
    }

    const exit = () => {
        window.location.href = "/"
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
                            onChange={inputChange} 
                            onFocus={inputFocus}
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
