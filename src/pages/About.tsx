
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

const About = () => {
  const { toast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = React.useState("en");

  const handleContact = (type: string) => {
    let message = "";
    switch (type) {
      case "email":
        message = "Contact email: xmrtsolutions@gmail.com";
        break;
      case "phone":
        message = "Contact phone: +1 (555) 123-4567";
        break;
      default:
        message = "Visit our office: 123 Travel Street, Digital City";
    }
    
    toast({
      title: "Contact Information",
      description: message,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F1F0FB]">
      <Header 
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
      />
      
      <main className="flex-grow container py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          <section className="bg-white rounded-lg p-8 shadow-sm">
            <h1 className="text-3xl font-bold text-[#6E59A5] mb-6">About Travel XMRT</h1>
            <p className="text-[#8E9196] mb-6">
              Travel XMRT is your intelligent travel companion, designed to make global exploration seamless and effortless. 
              Our AI-powered platform helps travelers overcome language barriers, navigate unfamiliar territories, and make 
              informed decisions about their journeys.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#F1F0FB] p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-[#6E59A5] mb-3">Translation</h3>
                <p className="text-[#8E9196]">
                  Real-time translation powered by advanced AI, helping you communicate effortlessly across languages.
                </p>
              </div>
              <div className="bg-[#F1F0FB] p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-[#6E59A5] mb-3">Navigation</h3>
                <p className="text-[#8E9196]">
                  Smart navigation tools to help you explore new destinations with confidence.
                </p>
              </div>
              <div className="bg-[#F1F0FB] p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-[#6E59A5] mb-3">AI Assistant</h3>
                <p className="text-[#8E9196]">
                  Personalized travel recommendations and itinerary optimization using cutting-edge AI.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-[#6E59A5] mb-6">Our Mission</h2>
            <p className="text-[#8E9196] mb-6">
              At Travel XMRT, we believe that technology should enhance the human experience of travel, not complicate it. 
              Our mission is to break down language barriers, simplify navigation, and provide intelligent travel insights 
              that make every journey memorable.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div>
                <h3 className="text-xl font-semibold text-[#6E59A5] mb-4">Technology</h3>
                <ul className="space-y-3 text-[#8E9196]">
                  <li>• Advanced AI Translation</li>
                  <li>• Real-time Navigation</li>
                  <li>• Smart Itinerary Planning</li>
                  <li>• Safety Recommendations</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#6E59A5] mb-4">Benefits</h3>
                <ul className="space-y-3 text-[#8E9196]">
                  <li>• Seamless Communication</li>
                  <li>• Efficient Route Planning</li>
                  <li>• Cultural Insights</li>
                  <li>• Local Safety Information</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-[#6E59A5] mb-6">Contact Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="flex items-center gap-2 hover:bg-[#E5DEFF]"
                onClick={() => handleContact("email")}
              >
                <Mail className="h-4 w-4" />
                Email Us
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2 hover:bg-[#E5DEFF]"
                onClick={() => handleContact("phone")}
              >
                <Phone className="h-4 w-4" />
                Call Us
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2 hover:bg-[#E5DEFF]"
                onClick={() => handleContact("visit")}
              >
                <MapPin className="h-4 w-4" />
                Visit Us
              </Button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
