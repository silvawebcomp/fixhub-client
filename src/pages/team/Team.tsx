import "./Team.css";

import { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";
import {
    TEAM_ROLES,
    createTeamMember,
    deleteTeamMember,
    getTeam,
    updateTeamMember,
    type TeamMember,
    type TeamRole,
} from "../../services/teamService";
import { useAuth } from "../../hooks/useAuth";

type EditableRole = Exclude<TeamRole, "Owner">;

function Team() {
    const { user } = useAuth();
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<EditableRole>("Technician");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const canManage = user?.role === "Owner" || user?.role === "Admin";

    async function loadTeam() {
        setError("");

        try {
            const data = await getTeam();
            setTeam(data);
        } catch (requestError) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "Unable to load team."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        let active = true;

        getTeam()
            .then((data) => {
                if (active) {
                    setTeam(data);
                }
            })
            .catch((requestError) => {
                if (active) {
                    setError(
                        requestError instanceof Error
                            ? requestError.message
                            : "Unable to load team."
                    );
                }
            })
            .finally(() => {
                if (active) {
                    setLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, []);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaving(true);
        setError("");
        setSuccess("");

        try {
            await createTeamMember({
                name,
                email,
                password,
                role,
            });
            setName("");
            setEmail("");
            setPassword("");
            setRole("Technician");
            setSuccess("Team member added.");
            await loadTeam();
        } catch (requestError) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "Unable to add team member."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleRoleChange(member: TeamMember, nextRole: EditableRole) {
        setError("");
        setSuccess("");

        try {
            await updateTeamMember(member.id, nextRole);
            setSuccess("Role updated.");
            await loadTeam();
        } catch (requestError) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "Unable to update role."
            );
        }
    }

    async function handleDelete(member: TeamMember) {
        if (!window.confirm(`Remove ${member.name} from this workspace?`)) {
            return;
        }

        setError("");
        setSuccess("");

        try {
            await deleteTeamMember(member.id);
            setSuccess("Team member removed.");
            await loadTeam();
        } catch (requestError) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "Unable to remove team member."
            );
        }
    }

    return (
        <DashboardLayout>
            <section className="team-page">
                <header className="team-header">
                    <div>
                        <p className="eyebrow">Teams and permissions</p>
                        <h1>Team</h1>
                        <p>
                            Add staff accounts and control who can manage this FixHub
                            workspace.
                        </p>
                    </div>
                </header>

                {error && <p className="form-error">{error}</p>}
                {success && <p className="form-success">{success}</p>}

                <section className="team-grid">
                    <article className="team-panel">
                        <div className="panel-heading">
                            <h2>Add teammate</h2>
                            <p>Owners and admins can create staff logins.</p>
                        </div>

                        {!canManage ? (
                            <p className="team-note">
                                Your role can view the team, but cannot add or change
                                members.
                            </p>
                        ) : (
                            <form onSubmit={handleSubmit} className="team-form">
                                <label>
                                    Name
                                    <input
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                        required
                                    />
                                </label>

                                <label>
                                    Email
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        required
                                    />
                                </label>

                                <label>
                                    Temporary password
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(event.target.value)
                                        }
                                        minLength={6}
                                        required
                                    />
                                </label>

                                <label>
                                    Role
                                    <select
                                        value={role}
                                        onChange={(event) =>
                                            setRole(event.target.value as EditableRole)
                                        }
                                    >
                                        {TEAM_ROLES.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <button disabled={saving}>
                                    {saving ? "Adding..." : "Add teammate"}
                                </button>
                            </form>
                        )}
                    </article>

                    <article className="team-panel">
                        <div className="panel-heading">
                            <h2>Role guide</h2>
                            <p>Simple permissions for daily shop work.</p>
                        </div>
                        <dl className="role-guide">
                            <div>
                                <dt>Owner</dt>
                                <dd>Full access and permanent workspace owner.</dd>
                            </div>
                            <div>
                                <dt>Admin</dt>
                                <dd>Can manage teammates and daily operations.</dd>
                            </div>
                            <div>
                                <dt>Technician</dt>
                                <dd>Can work on repairs, inventory, and customer updates.</dd>
                            </div>
                            <div>
                                <dt>Front Desk</dt>
                                <dd>Can handle customers, intake, invoices, and updates.</dd>
                            </div>
                        </dl>
                    </article>
                </section>

                <section className="team-table">
                    {loading ? (
                        <p className="loading-state">Loading team...</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Joined</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {team.map((member) => (
                                    <tr key={member.id}>
                                        <td>
                                            <strong>{member.name}</strong>
                                            {member.isOwner && <span>Owner</span>}
                                        </td>
                                        <td>{member.email}</td>
                                        <td>
                                            {member.isOwner || !canManage ? (
                                                member.role
                                            ) : (
                                                <select
                                                    value={member.role}
                                                    onChange={(event) =>
                                                        void handleRoleChange(
                                                            member,
                                                            event.target
                                                                .value as EditableRole
                                                        )
                                                    }
                                                >
                                                    {TEAM_ROLES.map((option) => (
                                                        <option
                                                            key={option}
                                                            value={option}
                                                        >
                                                            {option}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                        </td>
                                        <td>
                                            {new Date(
                                                member.createdAt
                                            ).toLocaleDateString()}
                                        </td>
                                        <td>
                                            {!member.isOwner && canManage && (
                                                <button
                                                    className="danger-button"
                                                    onClick={() => void handleDelete(member)}
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </section>
            </section>
        </DashboardLayout>
    );
}

export default Team;
