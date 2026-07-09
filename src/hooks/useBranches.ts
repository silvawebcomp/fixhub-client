import { useQuery } from "@tanstack/react-query";

import { getBranches } from "../services/branchService";

export function useBranches() {
    return useQuery({
        queryKey: ["branches"],
        queryFn: getBranches,
    });
}
