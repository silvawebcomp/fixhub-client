import { apiRequest } from "./api";

export const TEAM_ROLES = ["Admin", "Technician", "Front Desk"] as const;

export type TeamRole = "Owner" | (typeof TEAM_ROLES)[number];

export interface TeamMember {
    id: number;
    name: string;
    email: string;
    role: TeamRole;
    createdAt: string;
    isOwner: boolean;
}

export interface TeamMemberPayload {
    name: string;
    email: string;
    password: string;
    role: Exclude<TeamRole, "Owner">;
}

export async function getTeam() {
    return apiRequest<TeamMember[]>("/team");
}

export async function createTeamMember(payload: TeamMemberPayload) {
    return apiRequest<TeamMember>("/team", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function updateTeamMember(id: number, role: Exclude<TeamRole, "Owner">) {
    return apiRequest<TeamMember>(`/team/${id}`, {
        method: "PUT",
        body: JSON.stringify({ role }),
    });
}

export async function deleteTeamMember(id: number) {
    await apiRequest(`/team/${id}`, {
        method: "DELETE",
    });
}
