import Image from "next/image";
import { urlFor } from "../../../sanity/lib/image";
import { GraduationCap, Target, Rocket, Award, CheckCircle2, ArrowRight, Star } from "lucide-react";

interface Facility {
  title: string;
  description: string;
  image?: any;
}

interface Achievement {
  title: string;
  year: string;
  description: string;
}

interface AboutData {
  title: string;
  description: string;
  establishedYear: string;
  affiliation: string;
  vision: string;
  mission: string;
  principalName: string;
  designation: string;
  principalMessage: string;
  principalImage?: any;
  facilities?: Facility[];
  achievements?: Achievement[];
}

type AboutProps = {
  data: AboutData;
};

export default function AboutSection({ data }: AboutProps) {
  const principalImageUrl = data.principalImage
    ? urlFor(data.principalImage)?.width(600).height(600).quality(90).url()
    : null;

  return (
    <section className="bg-[#F5F0E8] font-['Playfair_Display',serif]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        .about-section * { font-family: 'DM Sans', sans-serif; }
        .serif { font-family: 'Playfair Display', serif; }

        .hero-banner {
          background: linear-gradient(135deg, #1B3A6B 0%, #0F2347 50%, #1a2d5a 100%);
          position: relative;
          overflow: hidden;
        }
        .hero-banner::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }

        .vision-card {
          background: linear-gradient(135deg, #2563EB, #1D4ED8);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .vision-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(37,99,235,0.35); }

        .mission-card {
          background: linear-gradient(135deg, #F97316, #EA580C);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .mission-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(249,115,22,0.35); }

        .facility-card {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          background: white;
        }
        .facility-card:hover { transform: translateY(-8px); }
        .facility-card:hover .facility-img { transform: scale(1.08); }
        .facility-img { transition: transform 0.5s ease; }

        .achievement-item {
          transition: background 0.2s ease;
          border-left: 3px solid transparent;
        }
        .achievement-item:hover {
          background: white;
          border-left-color: #2563EB;
        }

        .principal-section {
          background: linear-gradient(135deg, #FFF8F0 0%, #FFF3E0 100%);
          border: 2px solid #FDDCB5;
        }

        .tag-pill {
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
        }

        .section-label {
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-size: 0.7rem;
          font-weight: 500;
        }

        .number-badge {
          background: linear-gradient(135deg, #1B3A6B, #2563EB);
          color: white;
          font-family: 'Playfair Display', serif;
          font-weight: 700;
        }

        .quote-mark {
          font-family: 'Playfair Display', serif;
          font-size: 8rem;
          line-height: 1;
          color: #F97316;
          opacity: 0.3;
        }

        .divider-ornament {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .divider-ornament::before,
        .divider-ornament::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, #C8B89A, transparent);
        }
      `}</style>

      <div className="about-section">

        {/* ===== Hero Banner ===== */}
        <div className="hero-banner px-6 md:px-16 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
              <div className="max-w-2xl">
                <div className="tag-pill inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-blue-200 section-label mb-6">
                  <GraduationCap size={12} />
                  About Our Institution
                </div>
                <h1 className="serif text-5xl md:text-7xl font-black text-white leading-[1.05] mb-6">
                  {data.title}
                </h1>
                <p className="text-blue-200 text-lg leading-relaxed max-w-xl font-light">
                  {data.description}
                </p>
              </div>

              <div className="flex flex-col gap-3 md:items-end shrink-0">
                <div className="tag-pill px-5 py-3 rounded-2xl text-center">
                  <div className="text-blue-300 section-label mb-0.5">Established</div>
                  <div className="text-white text-2xl serif font-bold">{data.establishedYear}</div>
                </div>
                <div className="tag-pill px-5 py-3 rounded-2xl text-center">
                  <div className="text-blue-300 section-label mb-0.5">Affiliation</div>
                  <div className="text-white font-semibold">{data.affiliation}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Vision & Mission ===== */}
        <div className="px-6 md:px-16 relative z-10">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-5">
            <div className="vision-card rounded-3xl p-8 text-white">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                  <Target size={22} className="text-white" />
                </div>
                <div>
                  <div className="section-label text-blue-200 mb-2">Our Vision</div>
                  <h2 className="serif text-2xl font-bold text-white mb-3">Where We're Headed</h2>
                  <p className="text-blue-100 leading-relaxed font-light">{data.vision}</p>
                </div>
              </div>
            </div>

            <div className="mission-card rounded-3xl p-8 text-white">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                  <Rocket size={22} className="text-white" />
                </div>
                <div>
                  <div className="section-label text-orange-200 mb-2">Our Mission</div>
                  <h2 className="serif text-2xl font-bold text-white mb-3">How We Get There</h2>
                  <p className="text-orange-100 leading-relaxed font-light">{data.mission}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Principal Message ===== */}
        <div className="px-6 md:px-16 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="divider-ornament mb-12">
              <span className="section-label text-[#8B7355] whitespace-nowrap">Principal's Message</span>
            </div>

            <div className="principal-section rounded-[2.5rem] p-8 md:p-12 overflow-hidden relative">
              <div className="absolute top-4 left-8 quote-mark leading-none select-none">"</div>

              <div className="relative flex flex-col md:flex-row gap-10 items-center">
                {principalImageUrl && (
                  <div className="shrink-0 relative">
                    <div className="absolute inset-0 bg-linear-to-br from-blue-200 to-orange-200 rounded-3xl blur-xl opacity-60 scale-105" />
                    <Image
                      src={principalImageUrl}
                      alt={data.principalName}
                      width={220}
                      height={280}
                      className="relative rounded-3xl object-cover shadow-2xl w-55 h-70"
                    />
                  </div>
                )}

                <div className="flex-1">
                  <div className="section-label text-[#8B7355] mb-3">Meet Our Principal</div>
                  <h2 className="serif text-3xl md:text-4xl font-bold text-[#1B3A6B] mb-1">
                    {data.principalName}
                  </h2>
                  <p className="text-orange-600 font-medium italic mb-6">{data.designation}</p>

                  <p className="text-slate-600 leading-relaxed text-lg font-light border-l-4 border-orange-400 pl-6">
                    {data.principalMessage}
                  </p>

                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-sm text-slate-500 font-medium">Excellence in Education</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Facilities ===== */}
        {data.facilities && data.facilities.length > 0 && (
          <div className="bg-[#1B3A6B] px-6 md:px-16 py-20">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
                <div>
                  <div className="section-label text-blue-400 mb-3">World-Class Infrastructure</div>
                  <h2 className="serif text-4xl md:text-5xl font-bold text-white">
                    Our Facilities
                  </h2>
                </div>
                <p className="text-blue-300 max-w-xs font-light leading-relaxed">
                  State-of-the-art environments designed to inspire learning and holistic growth.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.facilities.map((facility, index) => {
                  const facilityImageUrl = facility.image
                    ? urlFor(facility.image)?.width(800).height(500).url()
                    : null;

                  return (
                    <div key={index} className="facility-card rounded-3xl overflow-hidden shadow-xl">
                      <div className="relative overflow-hidden h-52">
                        <div className="number-badge absolute top-4 left-4 z-10 w-9 h-9 rounded-xl flex items-center justify-center text-sm">
                          {index + 1}.
                        </div>
                        {facilityImageUrl ? (
                          <Image
                            src={facilityImageUrl}
                            alt={facility.title}
                            width={400}
                            height={300}
                            className="facility-img object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full bg-linear-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                            <GraduationCap size={48} className="text-blue-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="font-bold text-white text-lg uppercase tracking-wide leading-tight">
                            {facility.title}
                          </h3>
                        </div>
                      </div>

                      <div className="p-5 flex items-start justify-between gap-3">
                        <p className="text-slate-600 text-sm leading-relaxed flex-1">
                          {facility.description}
                        </p>
                        <div className="shrink-0 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                          <ArrowRight size={14} className="text-blue-600" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ===== Achievements ===== */}
        {data.achievements && data.achievements.length > 0 && (
          <div className="px-6 md:px-16 py-20">
            <div className="max-w-6xl mx-auto">
              <div className="divider-ornament mb-12">
                <span className="section-label text-[#8B7355] whitespace-nowrap flex items-center gap-2">
                  <Award size={14} className="text-amber-500" />
                  School Achievements
                </span>
              </div>

              <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
                <h2 className="serif text-4xl md:text-5xl font-bold text-[#1B3A6B]">
                  Institutional<br />Excellence
                </h2>
                <p className="text-slate-500 max-w-xs font-light leading-relaxed">
                  Harmony has earned national and state recognition for providing global education.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                {data.achievements.map((item, index) => (
                  <div
                    key={index}
                    className="achievement-item flex gap-5 p-6 rounded-2xl cursor-default"
                  >
                    <div className="shrink-0 mt-1">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                        <CheckCircle2 size={18} className="text-amber-500" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                          {item.year}
                        </span>
                        <h3 className="serif font-bold text-[#1B3A6B] text-lg">{item.title}</h3>
                      </div>
                      <p className="text-slate-500 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}