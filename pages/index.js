import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import createEnturService from '@entur/sdk'

export default function Home() {

  const service = createEnturService({
    // Replace this with your own client name:
    clientName: 'chamedia-customtavle'
})

service.getDeparturesFromStopPlace('NSR:StopPlace:43916', {
  limit: 5, // We are only interested in the next five departures
  whiteListedModes: ['bus'] // We only care about busses
}).then(departures => console.log(departures))

  return (
    <div className={styles.container}>
      <h1>Hello world</h1>
    </div>
  )
}
