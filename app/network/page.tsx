'use client'

import Image from "next/image";
import {useEffect, useState} from "react";
import axios from "axios";
import {Edge, Waypoint} from "@/models/interfaces";
import {DataTable} from "@/components/table/data-table";
import {getColumns} from "@/components/table/columns";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {getNetworkColumns} from "@/components/table/network_columns";

export default function Home() {

    const [edges, setEdges] = useState<Edge[]>([]);
    const [connections, setConnections] = useState<Waypoint[]>([]);
    const [currentWaypoint, setCurrentWaypoint] = useState<Waypoint | null>(null);
    const [sheetState, setSheetState] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:8000/api/edges/DEL-SNU-NETWORK/')
            .then(response => {
                setEdges(response.data);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

    useEffect(() => {
        console.log(edges);
    }, [edges]);

    function setEdgeStatus(edge: Edge, status:boolean) {
        if(status){
            axios.post('http://localhost:8000/api/set-edge-online/', {
                edge_id: edge.id
            })
            .catch(error => {
                console.error('There was an error!', error);
            });

        }else{
            axios.post('http://localhost:8000/api/set-edge-offline/', {
                edge_id: edge.id
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
        }
    }


    function changeWaypoint(waypoint: Waypoint | null) {
        setCurrentWaypoint(waypoint);
        if(!sheetState) {
            setSheetState(true);
        }
        if(waypoint) {
            axios.get(`http://localhost:8000/api/edges/DEL-SNU-NETWORK/`)
                .then(response => {
                    setConnections(response.data);
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        }
    }


    return (
        <main className="flex bg-zinc-950 h-[calc(100vh-64px)] flex-col items-center overflow-hidden">
            <div className={'w-full h-screen flex flex-row'}>
                <div className={'w-full h-full flex flex-col mt-8 mx-20 space-y-4 mb-8'}>
                    <p className={'text-3xl'}>Network Edges</p>
                    <DataTable columns={getNetworkColumns(setEdgeStatus)} data={edges}/>
                </div>
            </div>
            <Sheet open={sheetState}>
                <SheetContent className={'w-[900px]'}>
                    <p className={'text-4xl'}>{currentWaypoint?.name}</p>
                    <p className={'text-md text-gray-500 mt-4'}>id: {currentWaypoint?.wp_id}</p>
                    <p className={'text-md text-gray-500'}>lat: {currentWaypoint?.latitude}</p>
                    <p className={'text-md text-gray-500 mb-4'}>long: {currentWaypoint?.longitude}</p>

                    <p className={'text-xl mb-2'}>Connections:</p>

                    {connections.map((waypoint, index) => (
                        <div key={index} className={'flex-col flex w-full border border-gray-700 rounded-xl p-4 mb-4'}>
                            <div className={'text-md'}>{waypoint.name}</div>
                            <div className={'text-sm text-gray-500'}>{waypoint.wp_id}</div>
                            <div className={'text-sm text-gray-500'}>{waypoint.latitude}</div>
                            <div className={'text-sm text-gray-500'}>{waypoint.longitude}</div>
                        </div>
                    ))}

                    <div className={'flex-col flex w-full border items-center hover:cursor-pointer hover:bg-zinc-900 justify-center border-gray-700 rounded-xl p-4 mb-4'}>
                        <p>+</p>
                    </div>

                    <Button className={'mt-4'} onClick={() => {
                        setSheetState(false);
                        setCurrentWaypoint(null)
                    }}>Close</Button>
                </SheetContent>
            </Sheet>
        </main>
    );
}