import { useQuery } from "@tanstack/react-query";

import {
    getInventory,
} from "../services/inventoryService";

export function useInventory(branchId?: string) {
    return useQuery({
        queryKey: ["inventory", branchId || "all"],
        queryFn: () => getInventory(branchId),
    });
}
