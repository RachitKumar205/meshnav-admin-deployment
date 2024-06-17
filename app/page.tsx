'use client'

import Image from "next/image";
import {useEffect, useState} from "react";
import axios from "axios";
import {Waypoint} from "@/models/interfaces";
import {DataTable} from "@/components/table/data-table";
import {getColumns} from "@/components/table/columns";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {toast} from "@/components/ui/use-toast";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {apiDomain} from "@/app/apiConfig";

interface DeleteResponse {
    status: string,
    message: string
}

export default function Home() {

    const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
    const [connections, setConnections] = useState<Waypoint[]>([]);
    const [currentWaypoint, setCurrentWaypoint] = useState<Waypoint | null>(null);
    const [sheetState, setSheetState] = useState(false);
    const [deleteResponse, setDeleteResponse] = useState<DeleteResponse | null>(null);
    const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
    const [deleteWaypointId, setDeleteWaypointId] = useState<string | null>(null);

    useEffect(() => {
        axios.get(`${apiDomain}/api/network_waypoints/DEL-SNU-NETWORK/`)
            .then(response => {
                setWaypoints(response.data);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

    function confirmDeleteWaypoint(wp_id: string) {
        if(wp_id) {
            axios.post(`${apiDomain}/api/delete-waypoint/`, {
                wp_id: wp_id,
            }).then(response => {
                setDeleteResponse(response.data)
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
        }
    }

    function deleteWaypoint(wp_id: string){
        setDeleteWaypointId(wp_id);
        setDeleteDialog(true);
    }

    useEffect(() => {
        if(deleteResponse){
            if(deleteResponse.status === 'success') {
                toast({title: deleteResponse.message})
            }else if(deleteResponse.status === 'error'){
                toast({title: deleteResponse.message, variant: 'destructive'})
            }
        }
    }, [deleteResponse]);

    function changeWaypoint(waypoint: Waypoint | null) {
        setCurrentWaypoint(waypoint);
        if(!sheetState) {
            setSheetState(true);
        }
        if(waypoint) {
            axios.get(`${apiDomain}/api/connected_waypoints/${waypoint?.wp_id}/`)
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
            <DataTable columns={getColumns(changeWaypoint, deleteWaypoint)} data={waypoints}/>
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
        <AlertDialog open={deleteDialog}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure you want to delete this waypoint?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the waypoint
                        data from the servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={()=>setDeleteDialog(false)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction className={'bg-red-600'} onClick={()=>confirmDeleteWaypoint(deleteWaypointId)}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    </main>
  );
}
