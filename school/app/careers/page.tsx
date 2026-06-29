import { getCurrentUser } from '../../lib/auth';
import { client } from "@/sanity/lib/client";
import { careerQuery, jobPostingsQuery } from '../lib/queries/career';
import JobPostingList from '../components/career/JobPostingList';
import { PortableText } from "@portabletext/react";
import  Footer  from '../components/Footer';

const fallbackHighlights = [
  {
    title: 'Student-first mission',
    description:
      'Every decision, program, and classroom moment is designed to help students discover confidence, curiosity, and lifelong learning habits.',
  },
  {
    title: 'Collaborative community',
    description:
      'Work alongside passionate educators, counselors, and support staff who share a growth mindset and a belief in whole-child success.',
  },
  {
    title: 'Professional growth',
    description:
      'Enjoy clear career pathways, regular training, mentorship, and a culture that invests in your development beyond the classroom.',
  },
  {
    title: 'Purposeful impact',
    description:
      'Your role directly supports students, families, and the school community as learners prepare for a future they can shape with confidence.',
  },
];

const fallbackBenefits = [
  {
    title: 'Meaningful work each day',
    description:
      'Teach, coach, guide, and support with a school community that values your contribution and celebrates student progress.',
  },
  {
    title: 'Supportive environment',
    description:
      'Benefit from collaborative leadership, responsive colleagues, and a caring culture that prioritizes wellbeing and balance.',
  },
  {
    title: 'Learning and development',
    description:
      'Access workshops, coaching, and professional development designed to sharpen your instructional craft and leadership skills.',
  },
  {
    title: 'A future-ready mission',
    description:
      'Join a school that blends academic excellence, creativity, and character education to prepare students for the next generation.',
  },
];


export default async function CareersPage() {
  const user = await getCurrentUser();
  const [careerData, jobPostings] = await Promise.all([
    client.fetch(careerQuery),
    client.fetch(jobPostingsQuery)
  ]);

  const hero = careerData?.hero || {};
  const overview = careerData?.overview || {};
  const highlights = careerData?.process?.length > 0 ? careerData.process : fallbackHighlights;
  const benefits = careerData?.eligibility?.length > 0 ? careerData.eligibility.map((e: any) => ({ title: e.role, description: e.criteria })) : fallbackBenefits;
  const cta = careerData?.cta || {};

  return (
    <>
      <main className="bg-slate-50 text-slate-900 careers-highlight">
        <section
          className="relative overflow-hidden isolate pt-24 sm:pt-28"
          style={{
            backgroundImage: `url('${hero.backgroundImage || '/images/career.png'}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="absolute inset-0 bg-slate-950/50" />
          <div className="absolute inset-x-0 top-0 h-72 bg-linear-to-b from-sky-200/30 to-transparent blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-14 sm:pb-20 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[1.1fr_auto] lg:items-end">
              <div className="max-w-3xl space-y-6">
                {hero.statusLabel && (
                  <span className="inline-flex items-center rounded-full bg-sky-900/30 px-3 py-1 text-sm font-medium text-sky-300 ring-1 ring-inset ring-sky-900/50">
                    {hero.statusLabel}
                  </span>
                )}
                <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {hero.title || "Build a brighter future with a school that believes in people first."}
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-fuchsia-800 sm:text-xl">
                  {hero.subtitle || "We create an environment where educators grow, students flourish, and every role contributes to meaningful learning and stronger communities."}
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                  <a
                    href="#open-roles"
                    className="inline-flex items-center justify-center rounded-full bg-sky-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-900/10 transition hover:bg-sky-800"
                  >
                    Explore open roles
                  </a>
                  <a
                    href="#culture"
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                  >
                    Discover our culture
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="culture" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div className="space-y-5">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">Our culture</p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                {overview.heading || "We nurture potential with purpose and thoughtful care."}
              </h2>
              <div className="max-w-xl text-base leading-8 text-slate-700 sm:text-lg">
                {overview.description ? (
                  <PortableText value={overview.description} />
                ) : (
                  <p>At School, culture is more than words. It is how we structure collaboration, guide growth, and create an uplifting environment where staff and students thrive.</p>
                )}
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {highlights.map((item: any) => (
                <article
                  key={item.title}
                  className="animate-fade-in-up rounded-[1.75rem] border border-slate-200/70 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]"
                >
                  <h3 className="text-xl font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="rounded-4xl border border-slate-200 bg-white/90 px-8 py-10 shadow-[0_28px_80px_rgba(15,23,42,0.08)] sm:px-10">
            <div className="grid gap-10 lg:grid-cols-[0.95fr_0.95fr] lg:items-center">
              <div className="space-y-5">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-600">Benefits for your career</p>
                <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  Grow your career with meaningful support and real opportunity.
                </h2>
                <p className="max-w-xl text-base leading-8 text-slate-700 sm:text-lg">
                  We offer a flexible, inclusive environment where professional development is built into the school experience and success is measured by the progress of our students.
                </p>
              </div>
              <div className="grid gap-4">
                {benefits.map((benefit: any) => (
                  <div
                    key={benefit.title}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
                  >
                    <h3 className="text-lg font-semibold text-slate-950">{benefit.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="open-roles" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Current openings</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Join our team and make a lasting impact.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
              If you see a role that fits your strengths, we’d love to hear from you. Send your resume and cover letter to careers@school.edu.
            </p>
          </div>

          <JobPostingList postings={jobPostings} />
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
          <div className="rounded-4xl border border-slate-200 bg-white p-10 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Ready to grow?</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  {cta.heading || "Help shape the next generation while deepening your own career."}
                </h2>
                {cta.description && (
                   <p className="mt-2 text-slate-600">{cta.description}</p>
                )}
              </div>
              <a
                href={cta.primaryButtonLink || "mailto:careers@school.edu"}
                className="inline-flex items-center justify-center rounded-full bg-sky-900 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-900/10 transition hover:bg-sky-800"
              >
                {cta.primaryButtonText || "Contact our careers team"}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer/>
    </>
  );
}
