import { useState } from "react";
import { DeviceViewer3D } from "./DeviceViewer3D";
import { ChatInterface } from "./ChatInterface";
import { Card } from "./ui/card";
import { Activity, Heart, Zap, Shield } from "lucide-react";

const MedicalEducation = () => {
  const [highlightedPart, setHighlightedPart] = useState<string | undefined>();

  const handlePartMention = (partName: string) => {
    setHighlightedPart(partName);
    // Clear highlight after 3 seconds
    setTimeout(() => setHighlightedPart(undefined), 3000);
  };

  const features = [
    {
      icon: Activity,
      title: "Real-time Monitoring",
      description: "Continuous heart rhythm monitoring with instant response"
    },
    {
      icon: Heart,
      title: "Adaptive Therapy",
      description: "Smart pacing that adjusts to your daily activities"
    },
    {
      icon: Zap,
      title: "Long Battery Life",
      description: "8-12 years of reliable power with low-energy design"
    },
    {
      icon: Shield,
      title: "MRI Safe",
      description: "Compatible with medical imaging when properly configured"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-surface">
      {/* Hero Section */}
      <section className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-medical opacity-90" />
        
        <div className="relative container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Understanding Medical Devices
            <br />
            <span className="text-medical-secondary">Made Simple</span>
          </h1>
          <p className="text-lg mb-6 max-w-2xl mx-auto opacity-90">
            Explore interactive 3D models and get instant answers about complex medical devices. 
            Perfect for patients and healthcare education.
          </p>
          
          <div className="flex justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Activity className="w-4 h-4" />
              Interactive 3D Models
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Heart className="w-4 h-4" />
              AI-Powered Education
            </div>
          </div>
        </div>
      </section>

      {/* Main Interface */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Interactive Pacemaker Implant System
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore how a pacemaker is implanted in the human body. Click on device components or anatomy parts to learn more, 
              or chat with our AI assistant about the implantation procedure and how the system works.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-12">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-medical-primary">3D Implant System</h3>
              <DeviceViewer3D 
                highlightedPart={highlightedPart}
                onPartClick={handlePartMention}
              />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3 text-medical-primary">AI Assistant</h3>
              <ChatInterface onPartMention={handlePartMention} />
            </div>
          </div>

          {/* Device Features */}
          <div>
            <h3 className="text-xl font-bold text-center mb-6 text-foreground">
              Key Device Features
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="p-4 text-center shadow-soft border-medical-primary/10 hover:shadow-medical transition-shadow">
                    <div className="w-10 h-10 bg-gradient-medical rounded-full flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-semibold mb-2 text-medical-primary text-sm">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MedicalEducation;
