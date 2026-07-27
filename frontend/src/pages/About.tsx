import { Users, Award, BookOpen, Target } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-orange-200 via-orange-50 to-[#f8f9fa] pt-32 pb-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-heading mb-6 tracking-tight">
            Empowering Learners Worldwide
          </h1>
          <p className="text-xl text-body max-w-3xl mx-auto leading-relaxed">
            We are on a mission to democratize education by providing high-quality, accessible, and practical learning experiences for everyone, everywhere.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-heading mb-6">Our Story</h2>
              <div className="space-y-4 text-body leading-relaxed text-lg">
                <p>
                  Founded in 2024, Pibots Robotics started with a simple idea: that quality education shouldn't be limited by geography or background.
                </p>
                <p>
                  We gathered industry experts, passionate educators, and technology enthusiasts to build a platform that focuses on practical, project-based learning. We don't just teach theory; we help you build real-world skills.
                </p>
                <p>
                  Today, we are proud to support a growing community of thousands of students across the globe, helping them achieve their career goals and discover new passions.
                </p>
              </div>
            </div>
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Team collaborating" className="rounded-2xl shadow-xl w-full h-[400px] object-cover" />
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl border border-border flex items-center gap-4">
                <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center">
                  <Users className="w-7 h-7 text-orange-600" />
                </div>
                <div>
                  <div className="text-3xl font-heading font-extrabold text-heading">10k+</div>
                  <div className="text-body font-medium">Students Enrolled</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-heading mb-16">Our Core Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: <Target className="w-7 h-7 text-orange-600" />, title: 'Practical Learning', desc: 'Focus on real-world projects and applicable skills.' },
              { icon: <Users className="w-7 h-7 text-orange-600" />, title: 'Community', desc: 'Foster collaboration and support among learners.' },
              { icon: <Award className="w-7 h-7 text-orange-600" />, title: 'Excellence', desc: 'Maintain high standards in content and teaching.' },
              { icon: <BookOpen className="w-7 h-7 text-orange-600" />, title: 'Accessibility', desc: 'Make education affordable and available to all.' }
            ].map((value, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-border shadow-sm hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-heading font-bold text-heading mb-3">{value.title}</h3>
                <p className="text-body text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
