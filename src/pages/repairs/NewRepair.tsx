import "./NewRepair.css";

function NewRepair() {
    return (
        <main className="new-repair-page">

            <h1>New Repair</h1>

            <form className="repair-form">

                <input
                    type="text"
                    placeholder="Customer Name"
                />

                <input
                    type="text"
                    placeholder="Phone Number"
                />

                <input
                    type="text"
                    placeholder="Device"
                />

                <select>
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                </select>

                <textarea
                    placeholder="Repair Notes"
                ></textarea>

                <button type="submit">
                    Save Repair
                </button>

            </form>

        </main>
    );
}

export default NewRepair; 