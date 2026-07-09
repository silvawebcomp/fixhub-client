import { useQuery } from "@tanstack/react-query";

import {
    getRepairs,
} from "../api/repairApi";

export function useRepairs(branchId?: string) {
    return useQuery({
        queryKey: ["repairs", branchId || "all"],
        queryFn: () => getRepairs(branchId),
    });
}
