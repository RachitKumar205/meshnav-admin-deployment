export interface Waypoint {
    id: number | null;
    name: string;
    wp_id: string;
    latitude: number;
    longitude: number;
}

export interface Edge {
    id: number;
    online: boolean;
    waypoints: Waypoint[];
}
