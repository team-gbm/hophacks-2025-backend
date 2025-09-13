import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei";
import { useRef, useState } from "react";
import { Mesh } from "three";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DevicePart {
  name: string;
  position: [number, number, number];
  color: string;
  description: string;
  isImplanted?: boolean;
  deviceType: 'pacemaker' | 'insulin-pump';
}

const deviceParts: DevicePart[] = [
  { name: "Pacemaker Device", position: [-2, 1, -1], color: "#0ea5e9", description: "Main device implanted under the skin near the collarbone", isImplanted: true, deviceType: 'pacemaker' },
  { name: "Right Atrial Lead", position: [0.5, 2, 0], color: "#10b981", description: "Lead positioned in the right atrium to sense and pace", isImplanted: true, deviceType: 'pacemaker' },
  { name: "Right Ventricular Lead", position: [0.3, 0.5, 0], color: "#f59e0b", description: "Lead positioned in right ventricle for ventricular pacing", isImplanted: true, deviceType: 'pacemaker' },
  { name: "Left Ventricular Lead", position: [-0.3, 0.5, 0], color: "#ef4444", description: "Optional lead for cardiac resynchronization therapy", isImplanted: true, deviceType: 'pacemaker' },
  { name: "Insulin Pump", position: [3, -0.5, 0], color: "#8b5cf6", description: "External device that delivers insulin continuously", isImplanted: false, deviceType: 'insulin-pump' },
  { name: "Infusion Set", position: [1.5, -0.5, 0], color: "#06b6d4", description: "Tubing that connects pump to insertion site", isImplanted: false, deviceType: 'insulin-pump' },
  { name: "Cannula", position: [0.5, -0.5, 0.5], color: "#f97316", description: "Small tube inserted under the skin to deliver insulin", isImplanted: true, deviceType: 'insulin-pump' },
];

const anatomyParts = [
  { name: "Heart", position: [0, 1, 0] as [number, number, number], color: "#dc2626", description: "The heart muscle that the pacemaker regulates" },
  { name: "Ribcage", position: [0, 1, 0] as [number, number, number], color: "#e5e7eb", description: "Protective bone structure around the heart" },
  { name: "Pacemaker Pocket", position: [-2, 1, -1] as [number, number, number], color: "#fbbf24", description: "Subcutaneous pocket where device is implanted" },
  { name: "Abdomen", position: [0, -0.5, 0] as [number, number, number], color: "#fbbf24", description: "Abdominal area where insulin pump cannula is typically inserted" },
];

const DevicePart = ({ part, isHighlighted, onClick }: { 
  part: DevicePart; 
  isHighlighted: boolean; 
  onClick: () => void; 
}) => {
  const meshRef = useRef<Mesh>(null);
  const isDevice = part.name === "Pacemaker Device";
  const isLead = part.name.includes("Lead");
  const isInsulinPump = part.name === "Insulin Pump";
  const isInfusionSet = part.name === "Infusion Set";
  const isCannula = part.name === "Cannula";

  if (isDevice) {
    return (
      <mesh
        ref={meshRef}
        position={part.position}
        onClick={onClick}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'default'}
      >
        <boxGeometry args={[0.6, 0.4, 0.3]} />
        <meshStandardMaterial 
          color={part.color} 
          metalness={0.8}
          roughness={0.1}
          emissive={isHighlighted ? part.color : "#000000"}
          emissiveIntensity={isHighlighted ? 0.4 : 0}
        />
      </mesh>
    );
  }

  if (isInsulinPump) {
    return (
      <group>
        {/* Main pump body */}
        <mesh
          ref={meshRef}
          position={part.position}
          onClick={onClick}
          onPointerOver={() => document.body.style.cursor = 'pointer'}
          onPointerOut={() => document.body.style.cursor = 'default'}
        >
          <boxGeometry args={[0.8, 1.2, 0.4]} />
          <meshStandardMaterial 
            color={part.color} 
            metalness={0.3}
            roughness={0.7}
            emissive={isHighlighted ? part.color : "#000000"}
            emissiveIntensity={isHighlighted ? 0.3 : 0}
          />
        </mesh>
        
        {/* Screen */}
        <mesh position={[part.position[0], part.position[1] + 0.2, part.position[2] + 0.21]}>
          <boxGeometry args={[0.5, 0.3, 0.02]} />
          <meshStandardMaterial 
            color="#1f2937"
            emissive="#3b82f6"
            emissiveIntensity={0.2}
          />
        </mesh>
        
        {/* Buttons */}
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[part.position[0] - 0.2 + i * 0.2, part.position[1] - 0.3, part.position[2] + 0.21]}>
            <cylinderGeometry args={[0.05, 0.05, 0.02, 8]} />
            <meshStandardMaterial color="#4b5563" />
          </mesh>
        ))}
      </group>
    );
  }

  if (isInfusionSet) {
    return (
      <group>
        {/* Tubing */}
        <mesh
          ref={meshRef}
          position={part.position}
          onClick={onClick}
          onPointerOver={() => document.body.style.cursor = 'pointer'}
          onPointerOut={() => document.body.style.cursor = 'default'}
          rotation={[0, 0, Math.PI / 6]}
        >
          <cylinderGeometry args={[0.03, 0.03, 1.5, 8]} />
          <meshStandardMaterial 
            color={part.color}
            transparent
            opacity={0.8}
            emissive={isHighlighted ? part.color : "#000000"}
            emissiveIntensity={isHighlighted ? 0.3 : 0}
          />
        </mesh>
      </group>
    );
  }

  if (isCannula) {
    return (
      <group>
        {/* Insertion site */}
        <mesh
          ref={meshRef}
          position={part.position}
          onClick={onClick}
          onPointerOver={() => document.body.style.cursor = 'pointer'}
          onPointerOut={() => document.body.style.cursor = 'default'}
        >
          <cylinderGeometry args={[0.08, 0.08, 0.02, 8]} />
          <meshStandardMaterial 
            color="#f3f4f6"
            emissive={isHighlighted ? part.color : "#000000"}
            emissiveIntensity={isHighlighted ? 0.2 : 0}
          />
        </mesh>
        
        {/* Cannula tube */}
        <mesh position={[part.position[0], part.position[1], part.position[2] - 0.1]}>
          <cylinderGeometry args={[0.01, 0.01, 0.2, 8]} />
          <meshStandardMaterial 
            color={part.color}
            metalness={0.8}
            roughness={0.2}
            emissive={isHighlighted ? part.color : "#000000"}
            emissiveIntensity={isHighlighted ? 0.4 : 0}
          />
        </mesh>
      </group>
    );
  }

  if (isLead) {
    return (
      <group>
        {/* Lead tip in heart */}
        <mesh
          ref={meshRef}
          position={part.position}
          onClick={onClick}
          onPointerOver={() => document.body.style.cursor = 'pointer'}
          onPointerOut={() => document.body.style.cursor = 'default'}
        >
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial 
            color={part.color} 
            metalness={0.9}
            roughness={0.1}
            emissive={isHighlighted ? part.color : "#000000"}
            emissiveIntensity={isHighlighted ? 0.5 : 0}
          />
        </mesh>
        
        {/* Lead wire */}
        <mesh position={[(part.position[0] - 2) / 2, (part.position[1] + 1) / 2, part.position[2]] as [number, number, number]}>
          <cylinderGeometry args={[0.02, 0.02, 2, 8]} />
          <meshStandardMaterial 
            color={part.color}
            metalness={0.9}
            roughness={0.1}
            emissive={isHighlighted ? part.color : "#000000"}
            emissiveIntensity={isHighlighted ? 0.3 : 0}
          />
        </mesh>
      </group>
    );
  }

  return null;
};

const AnatomyPart = ({ part, isHighlighted, onClick }: {
  part: typeof anatomyParts[0];
  isHighlighted: boolean;
  onClick: () => void;
}) => {
  const meshRef = useRef<Mesh>(null);

  if (part.name === "Heart") {
    return (
      <mesh
        ref={meshRef}
        position={part.position}
        onClick={onClick}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'default'}
        rotation={[0.2, 0, 0] as [number, number, number]}
      >
        <sphereGeometry args={[0.8, 12, 8]} />
        <meshStandardMaterial 
          color={part.color}
          transparent
          opacity={0.8}
          emissive={isHighlighted ? part.color : "#000000"}
          emissiveIntensity={isHighlighted ? 0.2 : 0}
        />
      </mesh>
    );
  }

  if (part.name === "Ribcage") {
    return (
      <group>
        {Array.from({ length: 6 }, (_, i) => (
          <mesh
            key={i}
            position={[Math.cos(i * 0.5) * 1.5, 1 + (i - 2.5) * 0.3, Math.sin(i * 0.5) * 0.5] as [number, number, number]}
            rotation={[0, i * 0.5, 0] as [number, number, number]}
          >
            <torusGeometry args={[0.8, 0.03, 4, 12, Math.PI]} />
            <meshStandardMaterial 
              color={part.color}
              transparent
              opacity={0.4}
            />
          </mesh>
        ))}
      </group>
    );
  }

  if (part.name === "Pacemaker Pocket") {
    return (
      <mesh
        ref={meshRef}
        position={part.position}
        onClick={onClick}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'default'}
      >
        <sphereGeometry args={[0.4, 12, 8]} />
        <meshStandardMaterial 
          color={part.color}
          transparent
          opacity={0.3}
          emissive={isHighlighted ? part.color : "#000000"}
          emissiveIntensity={isHighlighted ? 0.2 : 0}
        />
      </mesh>
    );
  }

  if (part.name === "Abdomen") {
    return (
      <mesh
        ref={meshRef}
        position={part.position}
        onClick={onClick}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'default'}
      >
        <cylinderGeometry args={[1.2, 1.0, 1.5, 12]} />
        <meshStandardMaterial 
          color={part.color}
          transparent
          opacity={0.2}
          emissive={isHighlighted ? part.color : "#000000"}
          emissiveIntensity={isHighlighted ? 0.2 : 0}
        />
      </mesh>
    );
  }

  return null;
};

interface DeviceViewer3DProps {
  highlightedPart?: string;
  onPartClick: (partName: string) => void;
}

export const DeviceViewer3D = ({ highlightedPart, onPartClick }: DeviceViewer3DProps) => {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [showAnatomy, setShowAnatomy] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<'pacemaker' | 'insulin-pump' | 'both'>('both');

  const handlePartClick = (partName: string) => {
    setSelectedPart(partName);
    onPartClick(partName);
  };

  // Filter devices based on selection
  const filteredDeviceParts = selectedDevice === 'both' 
    ? deviceParts 
    : deviceParts.filter(part => part.deviceType === selectedDevice);

  // Filter anatomy parts based on device selection
  const getRelevantAnatomyParts = () => {
    if (selectedDevice === 'pacemaker') {
      return anatomyParts.filter(part => 
        part.name === 'Heart' || part.name === 'Ribcage' || part.name === 'Pacemaker Pocket'
      );
    } else if (selectedDevice === 'insulin-pump') {
      return anatomyParts.filter(part => part.name === 'Abdomen');
    }
    return anatomyParts; // Show all for 'both'
  };

  const filteredAnatomyParts = getRelevantAnatomyParts();
  const allParts = [...filteredDeviceParts, ...filteredAnatomyParts];
  const selectedPartData = allParts.find(p => p.name === selectedPart);

  return (
    <Card className="w-full h-[600px] overflow-hidden shadow-medical border-medical-primary/20">
      <div className="relative h-full">
        <Canvas>
          <PerspectiveCamera makeDefault position={[4, 3, 6]} />
          <OrbitControls 
            enablePan={true} 
            enableZoom={true} 
            enableRotate={true}
            maxDistance={12}
            minDistance={3}
          />
          
          <ambientLight intensity={0.3} />
          <directionalLight position={[10, 10, 5]} intensity={1.2} />
          <pointLight position={[-10, -10, -5]} intensity={0.6} />
          <spotLight position={[0, 10, 0]} intensity={0.8} angle={0.6} penumbra={0.5} />
          
          <Environment preset="studio" />
          
          {/* Human anatomy */}
          {showAnatomy && filteredAnatomyParts.map((part) => (
            <AnatomyPart
              key={part.name}
              part={part}
              isHighlighted={highlightedPart === part.name || selectedPart === part.name}
              onClick={() => handlePartClick(part.name)}
            />
          ))}
          
          {/* Device components */}
          {filteredDeviceParts.map((part) => (
            <DevicePart
              key={part.name}
              part={part}
              isHighlighted={highlightedPart === part.name || selectedPart === part.name}
              onClick={() => handlePartClick(part.name)}
            />
          ))}
          
          {/* Ground plane */}
          <mesh position={[0, -2, 0]} receiveShadow>
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial color="#f8fafc" transparent opacity={0.5} />
          </mesh>
        </Canvas>

        {/* View controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {/* Device selector */}
          <div className="flex gap-1 bg-medical-surface/90 backdrop-blur-sm rounded-lg p-1 border border-medical-primary/20">
            <Button
              size="sm"
              variant={selectedDevice === 'pacemaker' ? "default" : "outline"}
              onClick={() => setSelectedDevice('pacemaker')}
              className="text-xs px-2 py-1 h-auto"
            >
              Pacemaker
            </Button>
            <Button
              size="sm"
              variant={selectedDevice === 'insulin-pump' ? "default" : "outline"}
              onClick={() => setSelectedDevice('insulin-pump')}
              className="text-xs px-2 py-1 h-auto"
            >
              Insulin Pump
            </Button>
            <Button
              size="sm"
              variant={selectedDevice === 'both' ? "default" : "outline"}
              onClick={() => setSelectedDevice('both')}
              className="text-xs px-2 py-1 h-auto"
            >
              Both
            </Button>
          </div>
          
          {/* Anatomy toggle */}
          <Button
            size="sm"
            variant={showAnatomy ? "default" : "outline"}
            onClick={() => setShowAnatomy(!showAnatomy)}
            className="bg-medical-surface/90 backdrop-blur-sm border-medical-primary/20"
          >
            {showAnatomy ? "Hide" : "Show"} Anatomy
          </Button>
        </div>

        {/* Part information overlay */}
        {selectedPart && selectedPartData && (
          <div className="absolute top-4 left-4 bg-medical-surface/95 backdrop-blur-sm border border-medical-primary/20 rounded-lg p-4 shadow-soft max-w-sm">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-medical-primary">{selectedPart}</h3>
              {selectedPartData && 'isImplanted' in selectedPartData && (selectedPartData as DevicePart).isImplanted && (
                <Badge variant="secondary" className="text-xs bg-medical-success/20 text-medical-success border-medical-success/30">
                  Implanted
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {selectedPartData.description}
            </p>
            <Button 
              size="sm" 
              variant="outline" 
              className="border-medical-primary/20"
              onClick={() => setSelectedPart(null)}
            >
              Close
            </Button>
          </div>
        )}

        {/* Controls hint */}
        <div className="absolute bottom-4 right-4 bg-medical-surface/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-muted-foreground">
          Click parts • Drag to rotate • Scroll to zoom • Toggle anatomy view
        </div>
      </div>
    </Card>
  );
};
