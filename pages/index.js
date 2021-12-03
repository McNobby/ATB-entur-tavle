import styles from "../styles/Home.module.css";
import createEnturService from "@entur/sdk";
import { useEffect, useState } from "react";
import RouteList from "../components/routeList";

export default function Home() {


	const service = createEnturService({ clientName: 'chaIM-customtavle' });

	return (
		<div className={styles.container}>
      <RouteList service={service} routeID="NSR:StopPlace:43916" limit={10} />
		</div>
	)
}