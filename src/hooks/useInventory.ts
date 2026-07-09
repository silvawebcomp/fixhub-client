import { useQuery } from "@tanstack/react-query";

import {
    getInventory,
} from "../api/inventoryApi";

export function useInventory(branchId?: string) {
    return useQuery({
        queryKey: ["inventory", branchId || "all"],
        queryFn: () => getInventory(branchId),
    });
}
