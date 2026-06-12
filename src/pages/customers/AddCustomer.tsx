import "./Customers.css";

function Customers() {
  return (
    <main className="customers-page">

      <header className="customers-header">
        <h1>Customers</h1>

        <button className="add-customer-btn">
          + Add Customer
        </button>
      </header>

      <section className="customers-search">

        <input
          type="text"
          placeholder="Search customers..."
        />

      </section>

      <section className="customers-table">

        <table>

          <thead>

            <tr>

              <th>Name</th>

              <th>Phone</th>

              <th>Device</th>

              <th>Status</th>

            </tr>

          </thead>

          <tbody>

            <tr>

              <td>John Doe</td>

              <td>08012345678</td>

              <td>iPhone 13</td>

              <td>In Progress</td>

            </tr>

            <tr>

              <td>Sarah James</td>

              <td>08198765432</td>

              <td>Samsung A55</td>

              <td>Completed</td>

            </tr>

          </tbody>

        </table>

      </section>

    </main>
  );
}

export default Customers;