import { useQuery } from "@tanstack/react-query";

import {
    getRepairs,
} from "../api/repairApi";

export function useRepairs() {
    return useQuery({
        queryKey: ["repairs"],
        queryFn: getRepairs,
    });
}