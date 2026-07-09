import { useQuery } from "@tanstack/react-query";

import {
    getInventory,
} from "../api/inventoryApi";

export function useInventory() {
    return useQuery({
        queryKey: ["inventory"],
        queryFn: getInventory,
    });
}