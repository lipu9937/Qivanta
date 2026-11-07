import PageHeader from "../components/ui/PageHeader";
import SectionTitle from "../components/ui/SectionTitle";
import Reveal from "../components/ui/Reveal";
import { CtaBanner } from "../components/home/Sections";

const values = [["Clear communication", "Weekly updates and plain language, no jargon."], ["Honest scoping", "We tell you what fits the budget and what does not."], ["Quality you can hand over", "Clean code, organised design files and documentation."], ["Ownership", "Your code, your designs, your accounts."]];

export default function About() {
  return (
    <>
      <PageHeader title="About us" subtitle="A small team of freelancers who work like one studio." />
      <section className="section">
        <div className="wrap grid lg:grid-cols-2 gap-12">
          <Reveal direction="right">
            <h2 className="text-3xl font-bold mb-4">Who we are</h2>
            <p className="text-slate-600 mb-4">We are independent designers and developers who joined forces so clients get everything in one place: strategy, design, development and support.</p>
            <p className="text-slate-600">Edit this page to tell your own story: how the team met, what you care about and the kind of clients you enjoy working with.</p>
          </Reveal>
          <div className="grid gap-6">
            <Reveal direction="left"><div className="card p-6"><h3 className="font-semibold text-lg mb-2">What we do</h3><p className="text-slate-600">Websites, web apps, mobile apps, UI/UX design and brand identities.</p></div></Reveal>
            <Reveal direction="left" delay={0.1}><div className="card p-6"><h3 className="font-semibold text-lg mb-2">How we work</h3><p className="text-slate-600">Remote-first, with a weekly call and a shared board you can follow anytime.</p></div></Reveal>
          </div>
        </div>
      </section>
      <section className="section bg-soft">
        <div className="wrap">
          <SectionTitle title="What you can expect" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(([t, d], i) => <Reveal key={t} delay={i * 0.08} className="h-full"><div className="card p-6 h-full"><h3 className="font-semibold mb-2">{t}</h3><p className="text-sm text-slate-600">{d}</p></div></Reveal>)}
          </div>
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
