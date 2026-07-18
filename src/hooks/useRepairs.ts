import { useQuery } from "@tanstack/react-query";

import {
    getRepairs,
} from "../services/repairService";

export function useRepairs(branchId?: string) {
    return useQuery({
        queryKey: ["repairs", branchId || "all"],
        queryFn: () => getRepairs(branchId),
    });
}
