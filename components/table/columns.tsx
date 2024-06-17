"use client"

import { ColumnDef } from "@tanstack/react-table"
import {Waypoint} from "@/models/interfaces";
import {Button} from "@/components/ui/button";
import {Trash2} from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const getColumns = (setCurrentWaypoint: (waypoint: Waypoint | null) => void, deleteWaypoint: (wp_id: string) => void): ColumnDef<Waypoint>[] => [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "wp_id",
        header: "Waypoint ID",
    },
    {
        accessorKey: "latitude",
        header: "Latitude",
    },
    {
        accessorKey: "longitude",
        header: "Longitude",
    },
    {
        id: "actions",
        cell: ({row}) => {
            const waypoint = row.original

            return (
                <Button className={'bg-purple-500 hover:bg-purple-300'} onClick={()=>setCurrentWaypoint(waypoint)}>Details</Button>
            )
        }
    },
    {
        id: "delete",
        cell: ({row}) => {
            const waypoint = row.original

            return (
                <Button className={'bg-red-700 hover:bg-red-500'} onClick={()=>deleteWaypoint(waypoint.wp_id)}><Trash2 /></Button>
            )
        }
    }
]
