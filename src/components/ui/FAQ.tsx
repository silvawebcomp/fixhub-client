function FAQ() {
  const questions = [
    {
      question: "Can a customer use FixHub without logging in?",
      answer:
        "Yes. Customers can use the repair tracking page with their ticket information to see progress updates without entering the admin workspace.",
    },
    {
      question: "Is FixHub only for phone repairs?",
      answer:
        "No. The V1 workflow works for phone, laptop, gadget, appliance, and electronics repair teams that need ticket, customer, stock, and invoice control.",
    },
    {
      question: "Can staff have different permissions?",
      answer:
        "Yes. FixHub separates owner, admin, technician, and front desk responsibilities so each team member works with the right level of access.",
    },
    {
      question: "Can I manage inventory and repairs together?",
      answer:
        "Yes. Parts can be tracked with stock details, supplier notes, branch location, reorder levels, and repair cost visibility.",
    },
    {
      question: "Does FixHub support branches?",
      answer:
        "Yes. V1 includes branch-ready screens for locations, repair queues, inventory filters, and business growth planning.",
    },
    {
      question: "Why is V1 intentionally simple?",
      answer:
        "The first version focuses on the daily flow users already understand: customer intake, repair tracking, stock, invoice, and pickup.",
    },
  ];

  return (
    <section className="faq" id="faq">
      <div className="section-header">
        <p>Common questions</p>
        <h2>Clear enough for new users, structured enough for scale.</h2>
      </div>

      <div className="faq-grid">
        {questions.map((item) => (
          <article key={item.question}>
            <h3>{item.question}</h3>
            <p>{item.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default FAQ;
