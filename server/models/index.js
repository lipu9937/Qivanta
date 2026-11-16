const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema, model } = mongoose;

const slugify = (s = "") => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const autoSlug = (schema) =>
  schema.pre("validate", function () {
    if (!this.slug && this.title) this.slug = slugify(this.title);
  });

const userSchema = new Schema({
  name: String,
  email: { type: String, unique: true, required: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "editor"], default: "admin" },
}, { timestamps: true });
userSchema.pre("save", async function () {
  if (this.isModified("password")) this.password = await bcrypt.hash(this.password, 10);
});
userSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

const leadSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  company: String,
  service: String,
  budget: String,
  timeline: String,
  message: { type: String, required: true },
  status: { type: String, enum: ["new", "contacted", "closed"], default: "new" },
  notes: { type: String, default: "" }, // NEW: private admin notes
}, { timestamps: true });

const serviceSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  category: String,
  icon: String,
  shortDescription: String,
  description: String,
  benefits: [String],
  process: [{ step: String, detail: String }],
  faqs: [{ question: String, answer: String }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });
autoSlug(serviceSchema);

const postSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  excerpt: String,
  content: String,
  coverImage: String,
  category: String,
  tags: [String],
  author: String,
  readTime: Number,
  published: { type: Boolean, default: false },
  views: { type: Number, default: 0 }, // NEW: article view counter
}, { timestamps: true });
autoSlug(postSchema);
postSchema.pre("validate", function () {
  if (this.content) this.readTime = Math.max(1, Math.round(this.content.split(/\s+/).length / 200));
});

const projectSchema = new Schema({
  title: { type: String, required: true },
  client: String,
  category: String,           // e.g. Web, Mobile, Design, Branding
  description: String,
  result: String,
  techStack: [String],
  liveUrl: String,
  image: String,
  featured: { type: Boolean, default: false },
}, { timestamps: true });

const testimonialSchema = new Schema({
  name: String, role: String, company: String, photo: String,
  quote: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  isFeatured: { type: Boolean, default: true },
}, { timestamps: true });

const teamSchema = new Schema({
  name: { type: String, required: true },
  role: String, bio: String, photo: String, linkedin: String, portfolio: String, skills: [String],
  order: { type: Number, default: 0 },
});

// NEW: FAQs shown on the home page and managed from the admin dashboard
const faqSchema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  order: { type: Number, default: 0 },
});

// NEW: social media links shown in the footer and on the Contact page.
// Only safe link types are allowed, so a "javascript:" link can never be saved.
const socialSchema = new Schema({
  name: { type: String, required: true, trim: true },
  handle: { type: String, default: "", trim: true },
  url: {
    type: String, required: true, trim: true,
    validate: { validator: (v) => /^(https?:\/\/|mailto:|tel:)/i.test(v), message: "Link must start with https://, http://, mailto: or tel:" },
  },
  color: {
    type: String, default: "", trim: true,
    validate: { validator: (v) => !v || /^#[0-9a-fA-F]{6}$/.test(v), message: "Color must look like #25D366" },
  },
  order: { type: Number, default: 0 },
});

// NEW: technologies shown in the moving strip on the home page
const techSchema = new Schema({
  name: { type: String, required: true, trim: true },
  order: { type: Number, default: 0 },
});

// NEW: one document with contact details and footer text (key is always "main")
const settingSchema = new Schema({
  key: { type: String, default: "main", unique: true },
  email: { type: String, default: "" },
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  hours: { type: String, default: "" },
  footerText: { type: String, default: "" },
  socialsSeeded: { type: Boolean, default: false },
  techSeeded: { type: Boolean, default: false },
});

const subscriberSchema = new Schema({
  email: { type: String, unique: true, required: true, lowercase: true },
  subscribedAt: { type: Date, default: Date.now },
});

module.exports = {
  User: model("User", userSchema),
  Lead: model("Lead", leadSchema),
  Service: model("Service", serviceSchema),
  Post: model("Post", postSchema),
  Project: model("Project", projectSchema),
  Testimonial: model("Testimonial", testimonialSchema),
  TeamMember: model("TeamMember", teamSchema),
  Subscriber: model("Subscriber", subscriberSchema),
  Faq: model("Faq", faqSchema),
  SocialLink: model("SocialLink", socialSchema),
  TechItem: model("TechItem", techSchema),
  SiteSetting: model("SiteSetting", settingSchema),
};
