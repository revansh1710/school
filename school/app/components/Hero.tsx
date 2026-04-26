'use client';

import React from 'react';

const Hero: React.FC = () => {
    return (
        <main className="relative overflow-hidden">
            <style jsx>{`
                .material-symbols-outlined {
                    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
                }
                .doodle-bg {
                    background-image: radial-gradient(circle at 2px 2px, #dce9ff 1px, transparent 0);
                    background-size: 32px 32px;
                }
                .sticker-shadow {
                    filter: drop-shadow(4px 4px 0px rgba(14, 165, 233, 0.1));
                }
                .organic-blob {
                    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
                }
            `}</style>

            {/* Background Doodles & Textures */}
            <div className="absolute inset-0 doodle-bg opacity-40 pointer-events-none"></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-tertiary-fixed/30 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 -left-24 w-64 h-64 bg-primary-fixed/20 rounded-full blur-3xl"></div>
            
            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content Column */}
                    <div className="space-y-8">

                        <h1 className="font-headline-xl text-yellow-700 tracking-tight max-w-xl">
                            Where Every Child's Story Begins with <span className="text-amber-400 relative">Wonder
                                <svg className="absolute -bottom-2 left-0 w-full" fill="none" height="12" viewBox="0 0 168 12" width="168" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2 10C35.5 4.5 90.5 -1.5 166 6" stroke="#fd761a" strokeLinecap="round" strokeWidth="4"></path>
                                </svg>
                            </span>
                        </h1>
                        <p className="font-body-lg text-on-surface-variant max-w-lg leading-relaxed">
                            Empowering curious minds through a blend of rigorous academics and creative discovery. See how we nurture the innovators of tomorrow.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                            <button className="w-full sm:w-auto bg-secondary-container text-on-primary font-headline-md text-lg px-8 py-4 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-orange-500/20">
                                Explore Our Curriculum
                            </button>
                            <button className="w-full sm:w-auto flex items-center justify-center gap-2 border-2 border-outline-variant text-on-surface font-label-md px-8 py-4 rounded-xl hover:border-primary-container hover:text-primary transition-all">
                                <span className="material-symbols-outlined">calendar_today</span>
                                Schedule a Tour
                            </button>
                        </div>
                        <div className="flex items-center gap-6 pt-8">
                            <div className="flex -space-x-4">
                                <img className="w-12 h-12 rounded-full border-2 border-white object-cover" alt="close-up portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCE0mNKX_r7v_RAjCD_TcWtY_nAX9nWigGqhwUSJK4QSzEb-5nd97bxsAK3QUcy0pWVINXC6_DBHTQyg6CAU5s5p2iaNqoDvuLFI3YFEJ8PfmkSmtncfRLWCCb6xaHpeSG4YEFDXs74lrqqTsG-XpO-DgiGGXcHQF_bAmn7WU7UhJudMgSG9NzOaOs8qBTL4rpfvcLARoAEm2rIJKTkhtxjkMMcdz52SNjoMMa-C0r5Pcnm8lIEH9-9GGVZLtcC6ARnympT4622oUg"/>
                                <img className="w-12 h-12 rounded-full border-2 border-white object-cover" alt="smiling young girl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAvygi5ovfDU7A2ZHb_TZu7HIJ3MsksasQdmCZetS02WUR-r-Lx-2xgWoZ-jxXzUQFKsBRl2zJN2-qfIGieYMqj4Kpni6Nj9xIwCdqlwZCPHjoCErG3a0r2GwlwNrUKSuAVQxhm6RCdtxPmkUYlkyEhLdW1wnKE7AVXWysMTwkWznJn0gppubyzk2MpcssLRlwd-ESTkK24-stM3RO-P9bfgPITJlZ2sTvqdfWbhO4WOpc_iqPd1tsqAN00q4NJHLXfuPFlh-xe7E"/>
                                <img className="w-12 h-12 rounded-full border-2 border-white object-cover" alt="joyful young boy" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBt36eTt9jnw72A9HmB5aHxlNMwNeXcxRYjKbd0-V8uEfRAlDEeT2uVit3EqEj0YPZJCurUf38fNxCNMNy9RL75uqZDNm8_d_kOqgLEgytNP_TBdODab4-8tRwBwIEbPeZHEs_rKluuIxORpe-cZ9E9WNzs2asWAAGPuR6MFJWucSzgm92dweHlMfjwid4eynJ92kNI3wr6ZlHx7CJfGBQpufA8rMA1sEtNVhl97Tf9d6v3e2o-VLTi6Dn6MLuo8yJ5r_P7szzcjx4"/>
                            </div>
                            <div className="text-sm font-label-md text-on-surface-variant">
                                <span className="text-on-surface font-bold">500+</span> Families trust us
                            </div>
                        </div>
                    </div>
                    {/* Right Visual Column: Bento Grid Style */}
                    <div className="relative">
                        {/* Main Large Image */}
                        <div className="grid grid-cols-12 grid-rows-12 gap-4 h-150">
                            <div className="col-span-8 row-span-8 relative overflow-hidden rounded-3xl border-4 border-white shadow-2xl">
                                <img className="w-full h-full object-cover" alt="group of elementary students" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzQGpX_b-2kyvq3TvPcYaIkEMKuWoQtwkABsbTHyiN4KyoFYCRMspw4odrH90IGbhGoVOAuttmgDo0w-NuBmIzPDdR9pjU46yR7Tx5Ojln0dgQnSMrq8FL-2wDCPj5nM2YBstQoV5j-W4YAElxvx8ux9xXYZkk8b6VARDElUKl3WDlieKrz9bB63WeETXtdSfe8yddjxZpe5Le9Yo32lTDtjrEQ78aXFbp5-izboZb--1GUuxrcuxLw9ayXOqQjdNcrAwugLyxqyE"/>

                            </div>
                            <div className="col-span-4 row-span-5 relative overflow-hidden rounded-3xl border-4 border-white shadow-xl">
                                <img className="w-full h-full object-cover" alt="child painting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuATlWW8fx289-ZAKYmyW_tVz_0-shn8Dh0ajsWmjbMG4o_UpCz5QSpAxMkCXjzYrxbOP_eo0-dJnBBkZKcwIllU7bwOwvhqL91Kcmgp8r1nOOiSKxvqfgIbmy2Maxs5Ue4VqPuugL4ZKGpMm4FfRt_zuuC65Y9c8OqdQxs2qjh7Hfl6FBaSJSpukAcE-Pfw5peXgfTg_yq_nDiDkWUnGw_h9GjfDbddt30A0z6hFHriZZSjKMCu6Qd_gsDWagJr8FlgQ_Q2EJ1rZ4I"/>
                            </div>
                            <div className="col-start-9 col-span-4 row-start-6 row-span-7 bg-white rounded-3xl p-6 flex flex-col justify-end text-black shadow-xl">
                                <span className="material-symbols-outlined text-4xl mb-4">learn</span>
                                <h3 className="font-headline-md text-lg leading-tight">Igniting Future Paths</h3>
                            </div>
                            <div className="col-span-8 row-span-4 overflow-hidden rounded-3xl border-4 border-white shadow-xl relative group">
                                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Innovation" src="/images/hero1.jpg"/>
                                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg flex items-center gap-2">
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </section>
            
            {/* Quick Stats / Trust Bar */}
            <section className="max-w-7xl mx-auto px-6 pb-16">
                <div className="bg-surface-container rounded-[40px] p-8 md:p-12 border-2 border-white shadow-inner flex flex-wrap justify-around gap-8">
                    <div className="text-center group">
                        <div className="text-4xl md:text-5xl font-headline-xl text-primary mb-1">98%</div>
                        <div className="font-label-md text-on-surface-variant group-hover:text-primary transition-colors">Student Satisfaction</div>
                    </div>
                    <div className="w-px h-16 bg-outline-variant hidden md:block"></div>
                    <div className="text-center group">
                        <div className="text-4xl md:text-5xl font-headline-xl text-secondary-container mb-1">12:1</div>
                        <div className="font-label-md text-on-surface-variant group-hover:text-secondary transition-colors">Teacher Ratio</div>
                    </div>
                    <div className="w-px h-16 bg-outline-variant hidden md:block"></div>
                    <div className="text-center group">
                        <div className="text-4xl md:text-5xl font-headline-xl text-tertiary mb-1">25+</div>
                        <div className="font-label-md text-on-surface-variant group-hover:text-tertiary transition-colors">Creative Studios</div>
                    </div>
                    <div className="w-px h-16 bg-outline-variant hidden md:block"></div>
                    <div className="text-center group">
                        <div className="text-4xl md:text-5xl font-headline-xl text-primary-container mb-1">100%</div>
                        <div className="font-label-md text-on-surface-variant group-hover:text-primary-container transition-colors">Joyful Learning</div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Hero;