'use client'

import {DataTable} from "@/components/table/data-table";
import {getNetworkColumns} from "@/components/table/network_columns";
import {Sheet, SheetContent} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useEffect, useState} from "react";
import axios from "axios";
import {toast} from "@/components/ui/use-toast";
import {apiDomain} from "@/app/apiConfig";

interface EdgeResponse {
    status: string,
    message: string
}

export default function Home() {

    const [firstWaypoint, setFirstWaypoint] = useState<string | null>(null);
    const [secondWaypoint, setSecondWaypoint] = useState<string | null>(null);
    const [edgeResponse, setEdgeResponse] = useState<EdgeResponse | null>(null);

    function addEdge() {
        if(firstWaypoint && secondWaypoint) {
            axios.post(`${apiDomain}/api/edges/`, {
                start_wp: firstWaypoint,
                end_wp: secondWaypoint,
                network_id: "DEL-SNU-NETWORK"
            })
                .then(response => {
                    setEdgeResponse(response.data);
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        }else{
            alert("Please enter both waypoints")
        }
    }

    useEffect(() => {
        if(edgeResponse){
            if(edgeResponse.status === 'success') {
                toast({title: edgeResponse.message})
            }else if(edgeResponse.status === 'error'){
                toast({title: edgeResponse.message, variant: 'destructive'})
            }
        }
    }, [edgeResponse]);

    return (
        <main className="flex bg-zinc-950 h-[calc(100vh-64px)] flex-col items-center overflow-hidden">
            <div className={'w-full h-screen flex flex-row items-center justify-center'}>
                <div className={'border border-gray-700 p-4 rounded-xl w-3/12'}>
                    <p className={'text-3xl mt-2'}>Add Edges</p>
                    <p className={'mt-6'}>Enter First wp_id</p>
                    <Input className={'mt-2 w-full'} onChange={(e) => setFirstWaypoint(e.target.value)}/>

                    <p className={'mt-6'}>Enter Second wp_id</p>
                    <Input className={'mt-2 w-full'} onChange={(e) => setSecondWaypoint(e.target.value)}/>

                    <Button className={'mt-6 w-full bg-purple-500 hover:bg-purple-300'} onClick={addEdge}>Add Edge</Button>
                </div>
            </div>
        </main>
    )
}
