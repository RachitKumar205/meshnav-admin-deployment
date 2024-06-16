"use client"

import { ColumnDef } from "@tanstack/react-table"
import {Edge, Waypoint} from "@/models/interfaces";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Switch} from "@/components/ui/switch";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const getNetworkColumns = (setEdgeStatus: (edge: Edge, status: boolean) => void): ColumnDef<Edge>[] => [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        header: "Waypoint 1",
        cell: ({row}) => {
            const edge = row.original

            return (
                <p className={''}>{edge.waypoints[0].wp_id}</p>
            )
        }
    },
    {
        header: "Waypoint 2",
        cell: ({row}) => {
            const edge = row.original

            return (
                <p className={''}>{edge.waypoints[1].wp_id}</p>
            )
        }
    },
    {
        header: "Status",
        cell: ({row}) => {
            const edge = row.original

            return (
                <Badge className={edge.online ? 'bg-green-500' : 'bg-red-600'}>{edge.online ? "online" : "offline"}</Badge>
            )
        }
    },
    {
        id: "Change Status",
        cell: ({row}) => {
            const edge = row.original

            return (
                <Switch defaultChecked={edge.online} onCheckedChange={(checked)=>setEdgeStatus(edge, checked)} />
            )
        }
    }
]
