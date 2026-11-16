import PageHeader from "../components/ui/PageHeader";

// NEW: Privacy Policy and Terms pages. These are TEMPLATES: edit the text (and have it
// reviewed for your country) before going live. Replace hello@qivanta.studio with your email.
function Legal({ title, updated, sections }) {
  return (
    <>
      <PageHeader title={title} subtitle={`Last updated: ${updated}`} />
      <section className="section">
        <div className="wrap max-w-3xl space-y-8">
          {sections.map(([h, body]) => (
            <div key={h}>
              <h2 className="text-xl font-semibold mb-2">{h}</h2>
              <p className="text-slate-700">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export function Privacy() {
  return (
    <Legal title="Privacy Policy" updated="January 2026" sections={[
      ["What we collect", "When you send a quote request we store your name, email and the details you type (phone, company, budget, timeline, message). If you subscribe to the newsletter we store your email address."],
      ["How we use it", "We use your details only to reply to your request, send the updates you asked for, and improve our services. We do not sell your data."],
      ["Email", "You can unsubscribe from the newsletter at any time by writing to us, and we will remove your address."],
      ["Storage and security", "Data is kept in a secured database and is accessible only to our team. Please do not send passwords or payment details through the contact form."],
      ["Your rights", "You can ask to see, correct or delete the data we hold about you by emailing hello@qivanta.studio."],
    ]} />
  );
}

export function Terms() {
  return (
    <Legal title="Terms of Service" updated="January 2026" sections={[
      ["Using this website", "The content on this site is provided for general information. You agree not to misuse the site or try to disrupt it."],
      ["Quotes and projects", "A quote request is not a contract. Work begins after both sides agree on the scope, price and timeline in writing."],
      ["Ownership", "Unless agreed otherwise, you own the final deliverables once the final payment is received. We may show completed work in our portfolio."],
      ["Liability", "We take care to deliver quality work but cannot be held responsible for indirect losses arising from the use of this website or our deliverables."],
      ["Contact", "Questions about these terms? Email hello@qivanta.studio."],
    ]} />
  );
}
