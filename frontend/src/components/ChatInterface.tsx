import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  onPartMention: (partName: string) => void;
}

const deviceParts = ["Pacemaker Device", "Right Atrial Lead", "Right Ventricular Lead", "Left Ventricular Lead", "Heart", "Pacemaker Pocket"];

const getMockResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes("pacemaker device") || lowerMessage.includes("device")) {
    return "The pacemaker device is surgically implanted under the skin near your collarbone, in a small pocket created by the surgeon. It's about the size of a small matchbox and contains the battery, circuitry, and wireless communication components. The device is designed to last 8-12 years.";
  }
  
  if (lowerMessage.includes("right atrial lead") || lowerMessage.includes("atrial")) {
    return "The right atrial lead is a thin, flexible wire inserted through a vein and positioned in the right atrium (upper chamber) of your heart. It senses the heart's natural electrical activity and can deliver pacing pulses when needed to maintain proper rhythm.";
  }
  
  if (lowerMessage.includes("right ventricular lead") || lowerMessage.includes("ventricular")) {
    return "The right ventricular lead is positioned in the right ventricle (lower chamber) and is responsible for ventricular pacing. It ensures the ventricles contract properly to pump blood effectively throughout your body.";
  }
  
  if (lowerMessage.includes("left ventricular lead")) {
    return "The left ventricular lead is used in cardiac resynchronization therapy (CRT). It's positioned on the outside of the left ventricle through the coronary sinus, helping coordinate contractions between the left and right ventricles for better heart function.";
  }
  
  if (lowerMessage.includes("heart")) {
    return "Your heart is a muscular organ with four chambers - two atria (upper) and two ventricles (lower). The pacemaker monitors and supports your heart's electrical system, ensuring it beats at the right rate and rhythm to pump blood effectively.";
  }
  
  if (lowerMessage.includes("pocket") || lowerMessage.includes("implant")) {
    return "The pacemaker pocket is a small space created under your skin and chest muscle during surgery. It's typically located below your left collarbone. The pocket holds the device securely in place while allowing easy access for future procedures or replacements.";
  }
  
  if (lowerMessage.includes("surgery") || lowerMessage.includes("procedure")) {
    return "Pacemaker implantation is typically done under local anesthesia. The surgeon makes a small incision near your collarbone, creates the pocket, inserts the leads through a vein into your heart, tests the system, and connects everything to the pacemaker device. The procedure usually takes 1-3 hours.";
  }
  
  if (lowerMessage.includes("leads") && lowerMessage.includes("connect")) {
    return "The leads connect to your heart muscle and carry electrical signals in both directions - they sense your heart's natural rhythm and deliver pacing pulses when needed. They're designed to flex millions of times with each heartbeat over many years.";
  }
  
  if (lowerMessage.includes("how") && lowerMessage.includes("work")) {
    return "The pacemaker system works by continuously monitoring your heart through the leads. When it detects a pause or slow rhythm, it sends precisely timed electrical pulses through the leads to stimulate your heart muscle, restoring normal rhythm and ensuring adequate blood flow.";
  }
  
  return "I can help you understand the pacemaker implant system! Ask me about the device itself, the leads, how they connect to your heart, the implantation procedure, or how the whole system works together. You can also click on parts of the 3D model to learn more!";
};

export const ChatInterface = ({ onPartMention }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
      {
        id: "1",
        type: "bot",
        content: "Hello! I'm here to help you understand this pacemaker implant system. You can see how the device is placed in your body, where the leads connect to your heart, and how everything works together. Ask me about the implantation procedure, specific components, or click on parts of the 3D model!",
        timestamp: new Date(),
      },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Check if message mentions a part
    const mentionedPart = deviceParts.find(part => 
      inputValue.toLowerCase().includes(part.toLowerCase())
    );
    
    if (mentionedPart) {
      onPartMention(mentionedPart);
      toast(`Focusing on ${mentionedPart}`);
    }

    // Simulate AI response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: getMockResponse(inputValue),
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-[500px] flex flex-col shadow-medical border-medical-primary/20">
      <div className="p-4 border-b border-medical-primary/10 bg-gradient-medical text-white">
        <h3 className="font-semibold flex items-center gap-2">
          <Bot className="w-5 h-5" />
          Medical Device Assistant
        </h3>
        <p className="text-sm opacity-90">Ask me anything about this pacemaker</p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex gap-2 max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === "user" 
                    ? "bg-medical-primary text-white" 
                    : "bg-medical-secondary text-white"
                }`}>
                  {message.type === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`rounded-lg p-3 ${
                  message.type === "user"
                    ? "bg-medical-primary text-white"
                    : "bg-medical-surface-secondary border border-medical-primary/10"
                }`}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-medical-secondary text-white flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-medical-surface-secondary border border-medical-primary/10 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-medical-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-medical-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-medical-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-medical-primary/10">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about implantation, device parts, or procedure..."
            className="flex-1 border-medical-primary/20 focus:ring-medical-primary"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-medical-primary hover:bg-medical-primary/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
