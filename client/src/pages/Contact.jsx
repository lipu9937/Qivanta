import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Mail, Clock } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import SocialLinks from "../components/ui/SocialLinks";
import useFetch from "../hooks/useFetch";
import api, { errMsg } from "../services/api";

// Edit these lists to match your pricing
const budgets = ["Under $500", "$500 - $2,000", "$2,000 - $5,000", "$5,000+", "Not sure yet"];
const timelines = ["As soon as possible", "Within 1 month", "2 to 3 months", "Flexible"];

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.string().optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  message: z.string().min(10, "Please add more detail"),
});

export default function Contact() {
  const [params] = useSearchParams();
  const { data: services } = useFetch("/services");
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm({ resolver: zodResolver(schema), defaultValues: { service: params.get("service") || "" } });

  const onSubmit = async (values) => {
    try {
      const { data } = await api.post("/leads", values);
      toast.success(data.message);
      reset();
    } catch (e) {
      toast.error(errMsg(e));
    }
  };
  const Err = ({ k }) => errors[k] && <p className="text-red-600 text-sm mt-1">{errors[k].message}</p>;

  return (
    <>
      <PageHeader title="Request a quote" crumb="Contact" subtitle="Tell us about your project. We reply within 24 hours." />
      <section className="section bg-soft">
        <div className="wrap grid lg:grid-cols-5 gap-10">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="lg:col-span-3 space-y-4 bg-surface p-5 sm:p-8 rounded-2xl border border-slate-200 shadow-soft">
            <div><input {...register("name")} placeholder="Your name" aria-label="Your name" className="field" /><Err k="name" /></div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><input {...register("email")} type="email" placeholder="Email" aria-label="Email" className="field" /><Err k="email" /></div>
              <input {...register("phone")} placeholder="Phone (optional)" aria-label="Phone" className="field" />
            </div>
            <input {...register("company")} placeholder="Company or brand (optional)" aria-label="Company" className="field" />
            <select {...register("service")} aria-label="Service" className="field">
              <option value="">What do you need?</option>
              {(services || []).map((s) => <option key={s._id} value={s.title}>{s.title}</option>)}
            </select>
            <div className="grid sm:grid-cols-2 gap-4">
              <select {...register("budget")} aria-label="Budget" className="field"><option value="">Budget</option>{budgets.map((b) => <option key={b}>{b}</option>)}</select>
              <select {...register("timeline")} aria-label="Timeline" className="field"><option value="">Timeline</option>{timelines.map((t) => <option key={t}>{t}</option>)}</select>
            </div>
            <div><textarea {...register("message")} rows="5" placeholder="Tell us about your project" aria-label="Project details" className="field" /><Err k="message" /></div>
            <button disabled={isSubmitting} className="btn-primary w-full disabled:opacity-60">{isSubmitting ? "Sending..." : "Send request"}</button>
          </form>

          <div className="lg:col-span-2 space-y-8">
            <ul className="space-y-4 text-slate-700">
              <li className="flex gap-3"><Mail className="text-brand shrink-0" /> hello@qivanta.studio</li>
              <li className="flex gap-3"><Clock className="text-brand shrink-0" /> We reply within 24 hours</li>
            </ul>
            <SocialLinks />
            <div>
              <h2 className="text-lg font-semibold mb-3">What happens next</h2>
              <ol className="space-y-3 text-sm text-slate-600 list-decimal pl-5">
                <li>We read your request and may ask a few questions.</li>
                <li>We send a fixed quote and timeline.</li>
                <li>We start once you approve and pay the deposit.</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
