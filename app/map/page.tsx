'use client'


import React, {useEffect, useState} from "react";
import {Bubble, Line} from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import axios from "axios";
import Map, {Layer, Marker, Source} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Edge, Waypoint} from "@/models/interfaces";
import {Checkbox} from "@/components/ui/checkbox";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {toast} from "@/components/ui/use-toast";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function Home() {

    const [data, setData] = useState<Waypoint[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentWaypoint, setCurrentWaypoint] = useState<Waypoint | null>(null);
    const [graphUsers, setGraphUsers] = useState<boolean>(true)
    const [addWaypoint, setAddWaypoint] = useState<boolean>(false);
    const [mapStyle, setMapStyle] = useState<string>('mapbox://styles/mapbox/streets-v9');
    const [lines, setLines] = useState<any[]>([]);
    const [onlineLines, setOnlineLines] = useState<any[]>([]);
    const [offlineLines, setOfflineLines] = useState<any[]>([]);
    const [showEdges, setShowEdges] = useState<boolean>(true);

    useEffect(() => {
        const newLines = edges.map(edge => ({
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: edge.waypoints.map(waypoint => [waypoint.longitude, waypoint.latitude])
            }
        }));
        setLines(newLines);

        const onlineEdges = edges.filter(edge => edge.online);
        const offlineEdges = edges.filter(edge => !edge.online);

        const onlineLines = onlineEdges.map(edge => ({
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: edge.waypoints.map(waypoint => [waypoint.longitude, waypoint.latitude])
            }
        }));

        const offlineLines = offlineEdges.map(edge => ({
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: edge.waypoints.map(waypoint => [waypoint.longitude, waypoint.latitude])
            }
        }));

        setOnlineLines(onlineLines);
        setOfflineLines(offlineLines)

    }, [edges]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/edges/DEL-SNU-NETWORK/')
            .then(response => {
                setEdges(response.data);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:8000/nav/`); // Replace with your actual endpoint URL
            setData(response.data);
        } catch (error) {
            setError(error as any);
        } finally {
            setIsLoading(false);
        }
    };

    function changeMapStatus(status: string | boolean) {
        if(status){
            setMapStyle('mapbox://styles/mapbox/satellite-v9')
        }else{
            setMapStyle('mapbox://styles/mapbox/streets-v9')
        }
    }

    function setNewWaypoint() {
        setAddWaypoint(true);
        let newWaypoint: Waypoint = {
            id: null,
            name: '',
            latitude: 28.524169,
            longitude: 77.574015,
            wp_id: ""
        }
        setCurrentWaypoint(newWaypoint);
    }

    function submitNewWaypoint() {
        if(addWaypoint && currentWaypoint){
            if(currentWaypoint.wp_id === ""){
                toast({variant: "destructive", title: "Please enter a valid waypoint ID"})
                return;
            }
            if(currentWaypoint.name === ""){
                toast({variant: "destructive", title: "Please enter a valid waypoint name"})
                return;
            }
            axios.post('http://localhost:8000/nav/', {
                name: currentWaypoint.name,
                latitude: currentWaypoint.latitude,
                longitude: currentWaypoint.longitude,
                wp_id: currentWaypoint.wp_id
            })
                .then(response => {
                    toast({title: "Waypoint created successfully"});
                    setAddWaypoint(false);
                    setCurrentWaypoint(null);
                    fetchData();
                })
                .catch(error => {
                    console.error('There was an error!', error);
                    toast({variant: "destructive", title: "There was an error creating the waypoint!", description: "Check if waypoint with wp_id already exists"})
                });
        }else{
            toast({variant: "destructive", title: "Please add a waypoint first"})
        }
    }

    return (
        <main className="flex justify-start items-start bg-zinc-950 h-[calc(100vh-64px)] w-screen flex-row px-10 py-6">
            <div className={'w-[70%] h-full flex flex-row rounded-full'}>
                <Map
                    mapboxAccessToken="pk.eyJ1IjoicmFjaGl0a3VtYXIyMDUiLCJhIjoiY2xyb28yd2I3MDIxazJrbnpocjN4YTkzcCJ9.nP43qrue0MVVQim3guk0oQ"
                    initialViewState={{
                        latitude: 28.524169,
                        longitude: 77.574015,
                        zoom: 18
                    }}
                    style={{height: 600}}
                    mapStyle={mapStyle}
                >
                    {data.map((item) => (
                        <Marker
                            key={item.wp_id}
                            latitude={item.latitude}
                            longitude={item.longitude}
                            color="blue"
                            onClick={() => {
                                setAddWaypoint(false),
                                setCurrentWaypoint(item)
                            }}/>
                    ))}
                    {addWaypoint && <Marker
                        latitude={currentWaypoint?.latitude as number}
                        longitude={currentWaypoint?.longitude as number}
                        color="green"
                        draggable={true}
                        onDragEnd={(event: any) => {
                            let waypoint: Waypoint = {
                                id: null,
                                name: currentWaypoint?.name as string,
                                latitude: Number(event.lngLat.lat.toFixed(7)),
                                longitude: Number(event.lngLat.lng.toFixed(7)),
                                wp_id: ""
                            }

                            setCurrentWaypoint(waypoint);
                        }}
                    />}
                    {showEdges && <Source type="geojson" data={{
                        type: 'FeatureCollection',
                        features: onlineLines
                    }}>
                        <Layer type="line" paint={{
                            'line-color': 'green',
                            'line-width': 8
                        }}/>
                    </Source>}

                    {showEdges && <Source type="geojson" data={{
                        type: 'FeatureCollection',
                        features: offlineLines
                    }}>
                        <Layer type="line" paint={{
                            'line-color': 'red',
                            'line-width': 8
                        }}/>
                    </Source>}
                </Map>
            </div>
            <div className={'w-[30%] h-full flex flex-col items-center justify-start'}>
                <div className={'flex flex-row w-full items-center px-6 mb-3 space-x-2'}>
                    <Checkbox onCheckedChange={(checked) => changeMapStatus(checked)}/>
                    <p>Satellite Map</p>
                </div>

                <div className={'flex flex-row w-full items-center px-6 mb-3 space-x-2'}>
                    <Checkbox checked={showEdges} onCheckedChange={(checked) => {
                        if (typeof checked === 'boolean') {
                            setShowEdges(checked)
                        }
                    }
                    }
                    />
                    <p>Show Edges</p>
                </div>
                <Card className={"w-[90%] h-fit py-1 border border-gray-700"}>
                    {!currentWaypoint && (
                        <>
                            <CardHeader>Select a waypoint to get started</CardHeader>
                            <CardContent>Click on a marker on the map to view its details.</CardContent>
                        </>
                    )}
                    {(currentWaypoint && !addWaypoint) && (
                        <>
                            {/* Extract and display relevant information from the corresponding waypoint object */}
                            <CardHeader className={"text-2xl"}>Store: {currentWaypoint.name}</CardHeader>
                            <CardContent className={'h-fit'}>
                                <div className={"text-gray-400 text-sm"}>
                                    Waypoint ID: {currentWaypoint.wp_id}
                                </div>
                                <div className={"text-gray-400 text-sm"}>
                                    Lat: {currentWaypoint.latitude}
                                </div>
                                <div className={"text-gray-400 text-sm"}>
                                    Long: {currentWaypoint.longitude}
                                </div>

                            </CardContent>
                        </>
                    )}
                    {(currentWaypoint && addWaypoint) && (
                        <>
                            {/* Extract and display relevant information from the corresponding waypoint object */}
                            <CardHeader className={"text-2xl"}>Add a waypoint</CardHeader>
                            <CardContent className={'h-fit'}>
                                <div className={"text-gray-400 text-sm"}>
                                    Drag the marker to adjust the coordinates
                                </div>
                                <div className={"text-gray-400 text-sm mt-4"}>
                                    Waypoint ID
                                </div>
                                <Input className={'mt-2'} onChange={(e)=>{currentWaypoint.wp_id = e.target.value}}/>
                                <div className={"text-gray-400 text-sm mt-4"}>
                                    Waypoint Name
                                </div>
                                <Input className={'mt-2'} onChange={(e)=>{currentWaypoint.name = e.target.value}}/>
                                <div className={"text-gray-400 text-sm mt-4"}>
                                    Lat: {currentWaypoint.latitude}
                                </div>
                                <div className={"text-gray-400 text-sm"}>
                                    Long: {currentWaypoint.longitude}
                                </div>

                                <Button className={'w-full mt-6 bg-purple-500 hover:bg-purple-400'} onClick={submitNewWaypoint}>Submit</Button>
                                <Button className={'w-full mt-2 bg-red-700 hover:bg-red-500'} onClick={() => {
                                    setAddWaypoint(false);
                                    setCurrentWaypoint(null);
                                }}>Cancel</Button>

                            </CardContent>
                        </>
                    )}
                </Card>
                {!addWaypoint &&
                    <Button className={'w-[90%] bg-purple-500 hover:bg-purple-300 mt-4'} onClick={setNewWaypoint}>Add
                    Waypoint
                </Button>}
            </div>
        </main>
    );
}
