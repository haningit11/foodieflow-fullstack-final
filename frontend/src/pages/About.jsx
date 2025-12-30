import React from 'react';
import Card from '../components/ui/Card';
import { FaAward, FaHeart, FaLeaf, FaUsers, FaStar, FaUtensils } from 'react-icons/fa';

const About = () => {
  const teamMembers = [
    {
      name: 'Chef Maria Rodriguez',
      role: 'Executive Chef & Founder',
      bio: 'Michelin-trained with over 15 years of culinary excellence. Maria brings innovative techniques while honoring traditional flavors.',
      image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400',
      specialties: ['French Cuisine', 'Molecular Gastronomy', 'Farm-to-Table'],
    },
    {
      name: 'Chef James Wellington',
      role: 'Sous Chef',
      bio: 'Specialized in Mediterranean and Middle Eastern cuisine. James ensures every plate tells a story through balanced flavors and artistic presentation.',
      image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400',
      specialties: ['Mediterranean', 'Spice Blending', 'Plate Composition'],
    },
    {
      name: 'Sarah Chen',
      role: 'Pastry Chef',
      bio: 'Le Cordon Bleu graduate creating exquisite desserts that perfectly complement our savory offerings while pushing creative boundaries.',
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
      specialties: ['French Patisserie', 'Chocolate Work', 'Modern Plating'],
    },
  ];

  const values = [
    {
      icon: FaLeaf,
      title: 'Sustainable Sourcing',
      description:
        'We partner with local farms and ethical suppliers to ensure the highest quality ingredients while supporting our community.',
    },
    {
      icon: FaHeart,
      title: 'Passion-Driven',
      description:
        'Every dish is crafted with genuine care and attention to detail, reflecting our love for culinary excellence.',
    },
    {
      icon: FaUtensils,
      title: 'Innovative Cuisine',
      description:
        'We blend traditional techniques with modern creativity to deliver unique and memorable dining experiences.',
    },
    {
      icon: FaUsers,
      title: 'Community Focus',
      description:
        'Building relationships through food—we believe in creating connections that extend beyond the plate.',
    },
  ];

  return (
    <div className="min-h-screen bg-foodie-background">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Restaurant interior"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Crafting Culinary <span className="text-foodie-primary">Excellence</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto font-light">
            Where passion meets plate in a symphony of flavors.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800"
                  alt="Our kitchen"
                  className="w-full h-[600px] object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-foodie-primary/10 rounded-full z-0 blur-3xl"></div>
              <div className="absolute -top-8 -right-8 w-64 h-64 bg-foodie-secondary/10 rounded-full z-0 blur-3xl"></div>
            </div>

            <div className="space-y-8 order-1 lg:order-2">
              <div>
                <span className="inline-block px-4 py-1.5 bg-foodie-primary/10 text-foodie-primary font-semibold text-sm rounded-full mb-4">
                  OUR JOURNEY
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-foodie-text leading-tight mb-6">
                  A Legacy of <span className="text-foodie-primary">Flavor</span> & Innovation
                </h2>
                <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                  <p>
                    Founded in 2020, FoodieFlow emerged from a simple yet powerful vision: to redefine casual fine dining by blending culinary artistry with approachable elegance.
                  </p>
                  <p>
                    Our philosophy centers on the belief that exceptional dining should be accessible, memorable, and consistently surprising. We challenge conventions while respecting traditions, creating dishes that tell stories and evoke emotions.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
                <div className="flex items-start gap-3">
                  <FaAward className="text-foodie-primary text-2xl mt-1" />
                  <div>
                    <h4 className="font-bold text-foodie-text">Michelin-trained</h4>
                    <p className="text-sm text-gray-500">Expert Chefs</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaLeaf className="text-foodie-primary text-2xl mt-1" />
                  <div>
                    <h4 className="font-bold text-foodie-text">Locally Sourced</h4>
                    <p className="text-sm text-gray-500">Fresh Ingredients</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaHeart className="text-foodie-primary text-2xl mt-1" />
                  <div>
                    <h4 className="font-bold text-foodie-text">Sustainable</h4>
                    <p className="text-sm text-gray-500">Eco-friendly</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-foodie-text mb-6">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide every decision we make and every dish we create.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl bg-foodie-background hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-foodie-primary/10"
              >
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm mb-6 group-hover:bg-foodie-primary group-hover:text-white transition-colors duration-300">
                  <value.icon className="text-2xl text-foodie-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-foodie-text mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-foodie-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-foodie-text mb-6">Meet Our Culinary Artists</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The talented individuals who bring creativity, expertise, and passion to your plate.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500"
              >
                <div className="relative h-80 overflow-hidden">
                  <div className="absolute inset-0 bg-foodie-charcoal/20 group-hover:bg-transparent transition-colors z-10"></div>
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 z-20">
                    <p className="text-foodie-primary font-bold text-sm mb-1">{member.role}</p>
                    <h3 className="text-2xl font-bold text-white">{member.name}</h3>
                  </div>
                </div>
                
                <div className="p-8">
                  <p className="text-gray-600 mb-6 leading-relaxed min-h-[80px]">{member.bio}</p>
                  <div className="flex flex-wrap gap-2">
                    {member.specialties.map((specialty, specIndex) => (
                      <span
                        key={specIndex}
                        className="text-xs font-semibold text-foodie-text bg-foodie-background px-3 py-1.5 rounded-full border border-gray-100"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
