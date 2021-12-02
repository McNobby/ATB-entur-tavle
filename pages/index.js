import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import createEnturService from '@entur/sdk'
import { useState } from 'react'

export default function Home() {

  const [data, setData] = useState([]) 

  const service = createEnturService({
    clientName: 'chaIM-customtavle'
})

service.getDeparturesFromStopPlace('NSR:StopPlace:43916', { //NSR:StopPlace:43916 is Charlottenlund VGS
  limit: 5, // We are only interested in the next five departures
  whiteListedModes: ['bus'] // We only care about busses
})
.then(departures => {
    console.log(departures)
    // setData(departures)
})

  return (
    <div className={styles.container}>
      <h1>Hello world</h1>
    </div>
  )
}
