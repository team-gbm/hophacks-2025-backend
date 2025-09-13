
// --- MOCK DATA: 50+ diverse users for connections and suggestions ---
interface Connection {
  id: number;
  name: string;
  condition: string;
  journey: string;
  location: string;
  status: string;
}

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  location: string;
  bio: string;
}
interface SuggestedUser {
  id: number;
  name: string;
  bio: string;
  similarity: number;
  condition: string;
  location: string;
}
const mockConnections: Connection[] = [
  { id: 1, name: 'David R.', condition: 'Knee Surgery Recovery', journey: 'Week 3 of recovery', location: 'New York, USA', status: 'Similar journey' },
  { id: 2, name: 'Emma W.', condition: 'Multiple Sclerosis', journey: 'Managing symptoms for 2 years', location: 'London, UK', status: 'Can offer advice' },
  { id: 3, name: 'Carlos M.', condition: 'Diabetes Type 2', journey: 'Lost 20 lbs in 6 months', location: 'Miami, USA', status: 'Active lifestyle' },
  { id: 4, name: 'Aisha K.', condition: 'Breast Cancer Survivor', journey: 'Remission for 1 year', location: 'Toronto, Canada', status: 'Supportive' },
  { id: 5, name: 'Liam N.', condition: 'Anxiety', journey: 'Therapy for 3 years', location: 'Dublin, Ireland', status: 'Peer support' },
  { id: 6, name: 'Sophia L.', condition: 'Asthma', journey: 'Marathon runner', location: 'Sydney, Australia', status: 'Motivator' },
  { id: 7, name: 'Ming Z.', condition: 'Chronic Back Pain', journey: 'Yoga & PT', location: 'Shanghai, China', status: 'Pain management' },
  { id: 8, name: 'Olga P.', condition: 'Rheumatoid Arthritis', journey: 'Remission 2 years', location: 'Moscow, Russia', status: 'Advice' },
  { id: 9, name: 'Lucas F.', condition: 'ADHD', journey: 'College grad', location: 'Berlin, Germany', status: 'Mentor' },
  { id: 10, name: 'Priya S.', condition: 'PCOS', journey: 'Diet & exercise', location: 'Delhi, India', status: 'Lifestyle tips' },
  { id: 11, name: 'Noah B.', condition: 'Crohn’s Disease', journey: 'Surgery 2022', location: 'Cape Town, South Africa', status: 'Recovery' },
  { id: 12, name: 'Fatima H.', condition: 'Epilepsy', journey: 'Seizure-free 8 months', location: 'Cairo, Egypt', status: 'Encouragement' },
  { id: 13, name: 'Ethan J.', condition: 'Autism', journey: 'STEM student', location: 'San Jose, USA', status: 'STEM mentor' },
  { id: 14, name: 'Marta V.', condition: 'Fibromyalgia', journey: 'Mindfulness', location: 'Madrid, Spain', status: 'Mindfulness' },
  { id: 15, name: 'Yuki T.', condition: 'Depression', journey: 'Art therapy', location: 'Osaka, Japan', status: 'Creative support' },
  { id: 16, name: 'Samir G.', condition: 'Heart Disease', journey: 'Stent 2023', location: 'Dubai, UAE', status: 'Cardiac rehab' },
  { id: 17, name: 'Julia C.', condition: 'Celiac Disease', journey: 'Gluten-free 5 years', location: 'Rome, Italy', status: 'Diet mentor' },
  { id: 18, name: 'Omar E.', condition: 'PTSD', journey: 'Veteran', location: 'Riyadh, Saudi Arabia', status: 'Peer support' },
  { id: 19, name: 'Anna D.', condition: 'Bipolar Disorder', journey: 'Mood tracking', location: 'Stockholm, Sweden', status: 'Check-in buddy' },
  { id: 20, name: 'Lucas S.', condition: 'Leukemia Survivor', journey: 'Remission 3 years', location: 'Sao Paulo, Brazil', status: 'Inspiration' },
  { id: 21, name: 'Grace K.', condition: 'OCD', journey: 'CBT therapy', location: 'Seoul, South Korea', status: 'Routine tips' },
  { id: 22, name: 'Mohammed A.', condition: 'HIV+', journey: 'Undetectable', location: 'Lagos, Nigeria', status: 'Advocate' },
  { id: 23, name: 'Elena F.', condition: 'Migraines', journey: 'Trigger tracking', location: 'Paris, France', status: 'Advice' },
  { id: 24, name: 'Jack W.', condition: 'Parkinson’s', journey: 'Boxing therapy', location: 'Manchester, UK', status: 'Active' },
  { id: 25, name: 'Sara M.', condition: 'Endometriosis', journey: 'Surgery 2021', location: 'Istanbul, Turkey', status: 'Support' },
  { id: 26, name: 'Ivan K.', condition: 'Stroke Recovery', journey: 'Speech therapy', location: 'Warsaw, Poland', status: 'Motivator' },
  { id: 27, name: 'Linda G.', condition: 'COPD', journey: 'Quit smoking', location: 'Vancouver, Canada', status: 'Breathing tips' },
  { id: 28, name: 'Ahmed S.', condition: 'Kidney Transplant', journey: '1 year post-op', location: 'Amman, Jordan', status: 'Grateful' },
  { id: 29, name: 'Chloe B.', condition: 'Anorexia Recovery', journey: 'Therapy & nutrition', location: 'Zurich, Switzerland', status: 'Recovery' },
  { id: 30, name: 'Pedro L.', condition: 'Lupus', journey: 'Flare-free 6 months', location: 'Lisbon, Portugal', status: 'Advice' },
  { id: 31, name: 'Nina P.', condition: 'Sickle Cell', journey: 'Pain management', location: 'Accra, Ghana', status: 'Peer support' },
  { id: 32, name: 'George T.', condition: 'ALS', journey: 'Assistive tech', location: 'Athens, Greece', status: 'Tech mentor' },
  { id: 33, name: 'Isabella R.', condition: 'Thyroid Cancer', journey: 'Remission 2 years', location: 'Buenos Aires, Argentina', status: 'Hope' },
  { id: 34, name: 'Mateo C.', condition: 'Hearing Loss', journey: 'Cochlear implant', location: 'Mexico City, Mexico', status: 'Hearing tips' },
  { id: 35, name: 'Sofia D.', condition: 'Vision Impairment', journey: 'Braille reader', location: 'Barcelona, Spain', status: 'Accessibility' },
  { id: 36, name: 'Ravi V.', condition: 'Tuberculosis', journey: 'Cured 2024', location: 'Mumbai, India', status: 'Prevention' },
  { id: 37, name: 'Emily S.', condition: 'COVID-19 Long Hauler', journey: 'Fatigue management', location: 'Los Angeles, USA', status: 'Energy tips' },
  { id: 38, name: 'Hassan J.', condition: 'Liver Cirrhosis', journey: 'Transplant waitlist', location: 'Casablanca, Morocco', status: 'Hopeful' },
  { id: 39, name: 'Maya F.', condition: 'Epilepsy', journey: 'Medication adjustment', location: 'Tel Aviv, Israel', status: 'Advice' },
  { id: 40, name: 'Ben H.', condition: 'Hemophilia', journey: 'Sports adaptation', location: 'Brussels, Belgium', status: 'Active' },
  { id: 41, name: 'Zara Q.', condition: 'Psoriasis', journey: 'Topical therapy', location: 'Karachi, Pakistan', status: 'Skin care' },
  { id: 42, name: 'Tommy L.', condition: 'Tourette Syndrome', journey: 'CBIT therapy', location: 'Oslo, Norway', status: 'Support' },
  { id: 43, name: 'Helena S.', condition: 'Dyslexia', journey: 'Reading coach', location: 'Vienna, Austria', status: 'Mentor' },
  { id: 44, name: 'Victor M.', condition: 'Prostate Cancer', journey: 'Remission 1 year', location: 'Prague, Czechia', status: 'Hope' },
  { id: 45, name: 'Ava J.', condition: 'Cystic Fibrosis', journey: 'Lung therapy', location: 'Auckland, NZ', status: 'Breathing tips' },
  { id: 46, name: 'Owen D.', condition: 'Schizophrenia', journey: 'Peer support', location: 'Edinburgh, UK', status: 'Check-in buddy' },
  { id: 47, name: 'Layla M.', condition: 'PCOS', journey: 'Hormone therapy', location: 'Kuala Lumpur, Malaysia', status: 'Advice' },
  { id: 48, name: 'Jonas F.', condition: 'Ulcerative Colitis', journey: 'Remission 6 months', location: 'Copenhagen, Denmark', status: 'Diet tips' },
  { id: 49, name: 'Megan T.', condition: 'Eczema', journey: 'Allergy management', location: 'Boston, USA', status: 'Skin care' },
  { id: 50, name: 'Samuel W.', condition: 'Gout', journey: 'Diet change', location: 'Johannesburg, South Africa', status: 'Advice' },
];

const mockDoctors: Doctor[] = [
  { id: 201, name: 'Dr. Priya Mehta', specialty: 'Endocrinology', location: 'Boston, USA', bio: 'Specialist in diabetes and metabolic disorders.' },
  { id: 202, name: 'Dr. John Kim', specialty: 'Neurology', location: 'San Francisco, USA', bio: 'Expert in MS, epilepsy, and chronic pain.' },
  { id: 203, name: 'Dr. Fatima El-Sayed', specialty: 'Rheumatology', location: 'Cairo, Egypt', bio: 'Focus on autoimmune and joint conditions.' },
  { id: 204, name: 'Dr. Lucas Rossi', specialty: 'Cardiology', location: 'Rome, Italy', bio: 'Heart health and cardiac rehab.' },
  { id: 205, name: 'Dr. Ming Zhao', specialty: 'Psychiatry', location: 'Shanghai, China', bio: 'Mental health, mood, and anxiety disorders.' },
  { id: 206, name: 'Dr. Aisha Patel', specialty: 'Oncology', location: 'London, UK', bio: 'Cancer care and survivorship.' },
  { id: 207, name: 'Dr. George Mensah', specialty: 'Hematology', location: 'Accra, Ghana', bio: 'Blood disorders and sickle cell specialist.' },
  { id: 208, name: 'Dr. Sofia Delgado', specialty: 'Pulmonology', location: 'Barcelona, Spain', bio: 'Asthma, COPD, and lung health.' },
];

export const mockSuggested: SuggestedUser[] = [
  { id: 101, name: "Alice Smith", bio: "Runner, MS warrior, love to share tips!", similarity: 0.92, condition: "Multiple Sclerosis", location: "Boston, MA" },
  { id: 102, name: "Bob Lee", bio: "Recovering from knee surgery, hiking enthusiast.", similarity: 0.89, condition: "Knee Surgery Recovery", location: "Denver, CO" },
  { id: 103, name: "Priya Patel", bio: "Chronic pain advocate, yoga fan.", similarity: 0.87, condition: "Chronic Pain", location: "Austin, TX" },
  { id: 104, name: "Jin Park", bio: "Asthma, marathoner, techie.", similarity: 0.85, condition: "Asthma", location: "Seoul, South Korea" },
  { id: 105, name: "Fatima Noor", bio: "Epilepsy, student, loves painting.", similarity: 0.84, condition: "Epilepsy", location: "Cairo, Egypt" },
  { id: 106, name: "Lucas Müller", bio: "ADHD, gamer, college grad.", similarity: 0.83, condition: "ADHD", location: "Berlin, Germany" },
  { id: 107, name: "Sara Rossi", bio: "Fibromyalgia, mindfulness coach.", similarity: 0.82, condition: "Fibromyalgia", location: "Rome, Italy" },
  { id: 108, name: "Omar Al-Farsi", bio: "PTSD, veteran, peer supporter.", similarity: 0.81, condition: "PTSD", location: "Riyadh, Saudi Arabia" },
  { id: 109, name: "Anna Svensson", bio: "Bipolar, mood tracker, blogger.", similarity: 0.80, condition: "Bipolar Disorder", location: "Stockholm, Sweden" },
  { id: 110, name: "Mateo Lopez", bio: "Lupus, chef, foodie.", similarity: 0.79, condition: "Lupus", location: "Lisbon, Portugal" },
  { id: 111, name: "Nina Mensah", bio: "Sickle cell, peer mentor.", similarity: 0.78, condition: "Sickle Cell", location: "Accra, Ghana" },
  { id: 112, name: "George Papadopoulos", bio: "ALS, tech enthusiast.", similarity: 0.77, condition: "ALS", location: "Athens, Greece" },
  { id: 113, name: "Isabella Ruiz", bio: "Thyroid cancer survivor, hopeful.", similarity: 0.76, condition: "Thyroid Cancer", location: "Buenos Aires, Argentina" },
  { id: 114, name: "Pedro Martinez", bio: "Hearing loss, cochlear implant.", similarity: 0.75, condition: "Hearing Loss", location: "Mexico City, Mexico" },
  { id: 115, name: "Sofia Delgado", bio: "Vision impaired, accessibility advocate.", similarity: 0.74, condition: "Vision Impairment", location: "Barcelona, Spain" },
  { id: 116, name: "Ravi Verma", bio: "TB survivor, prevention advocate.", similarity: 0.73, condition: "Tuberculosis", location: "Mumbai, India" },
  { id: 117, name: "Emily Smith", bio: "COVID-19 long hauler, energy tips.", similarity: 0.72, condition: "COVID-19 Long Hauler", location: "Los Angeles, USA" },
  { id: 118, name: "Hassan Jafari", bio: "Liver cirrhosis, hopeful.", similarity: 0.71, condition: "Liver Cirrhosis", location: "Casablanca, Morocco" },
  { id: 119, name: "Maya Feldman", bio: "Epilepsy, med adjustment.", similarity: 0.70, condition: "Epilepsy", location: "Tel Aviv, Israel" },
  { id: 120, name: "Ben Huygens", bio: "Hemophilia, sports fan.", similarity: 0.69, condition: "Hemophilia", location: "Brussels, Belgium" },
  { id: 121, name: "Zara Qureshi", bio: "Psoriasis, skin care.", similarity: 0.68, condition: "Psoriasis", location: "Karachi, Pakistan" },
  { id: 122, name: "Tommy Larsen", bio: "Tourette, CBIT therapy.", similarity: 0.67, condition: "Tourette Syndrome", location: "Oslo, Norway" },
  { id: 123, name: "Helena Schmidt", bio: "Dyslexia, reading coach.", similarity: 0.66, condition: "Dyslexia", location: "Vienna, Austria" },
  { id: 124, name: "Victor Macek", bio: "Prostate cancer survivor.", similarity: 0.65, condition: "Prostate Cancer", location: "Prague, Czechia" },
  { id: 125, name: "Ava Jones", bio: "Cystic fibrosis, lung therapy.", similarity: 0.64, condition: "Cystic Fibrosis", location: "Auckland, NZ" },
  { id: 126, name: "Owen Douglas", bio: "Schizophrenia, peer support.", similarity: 0.63, condition: "Schizophrenia", location: "Edinburgh, UK" },
  { id: 127, name: "Layla Mahmud", bio: "PCOS, hormone therapy.", similarity: 0.62, condition: "PCOS", location: "Kuala Lumpur, Malaysia" },
  { id: 128, name: "Jonas Frederiksen", bio: "Ulcerative colitis, diet tips.", similarity: 0.61, condition: "Ulcerative Colitis", location: "Copenhagen, Denmark" },
  { id: 129, name: "Megan Taylor", bio: "Eczema, allergy management.", similarity: 0.60, condition: "Eczema", location: "Boston, USA" },
  { id: 130, name: "Samuel Williams", bio: "Gout, diet change.", similarity: 0.59, condition: "Gout", location: "Johannesburg, South Africa" },
  { id: 131, name: "Lina Chen", bio: "Asthma, swimmer.", similarity: 0.58, condition: "Asthma", location: "Beijing, China" },
  { id: 132, name: "Diego Torres", bio: "Diabetes, marathon runner.", similarity: 0.57, condition: "Diabetes Type 2", location: "Madrid, Spain" },
  { id: 133, name: "Sven Eriksson", bio: "Parkinson’s, boxing therapy.", similarity: 0.56, condition: "Parkinson’s", location: "Stockholm, Sweden" },
  { id: 134, name: "Maria Silva", bio: "Endometriosis, support group.", similarity: 0.55, condition: "Endometriosis", location: "Lisbon, Portugal" },
  { id: 135, name: "Ivan Kovac", bio: "Stroke recovery, speech therapy.", similarity: 0.54, condition: "Stroke Recovery", location: "Zagreb, Croatia" },
  { id: 136, name: "Linda Green", bio: "COPD, quit smoking.", similarity: 0.53, condition: "COPD", location: "Vancouver, Canada" },
  { id: 137, name: "Ahmed Saleh", bio: "Kidney transplant, grateful.", similarity: 0.52, condition: "Kidney Transplant", location: "Amman, Jordan" },
  { id: 138, name: "Chloe Baumann", bio: "Anorexia recovery, nutrition.", similarity: 0.51, condition: "Anorexia Recovery", location: "Zurich, Switzerland" },
  { id: 139, name: "George Tsiolis", bio: "ALS, tech mentor.", similarity: 0.50, condition: "ALS", location: "Athens, Greece" },
  { id: 140, name: "Isabella Rossi", bio: "Thyroid cancer, remission.", similarity: 0.49, condition: "Thyroid Cancer", location: "Rome, Italy" },
  { id: 141, name: "Mateo Cruz", bio: "Hearing loss, cochlear implant.", similarity: 0.48, condition: "Hearing Loss", location: "Mexico City, Mexico" },
  { id: 142, name: "Sofia Diaz", bio: "Vision impairment, braille reader.", similarity: 0.47, condition: "Vision Impairment", location: "Barcelona, Spain" },
  { id: 143, name: "Ravi Venkatesh", bio: "TB survivor, prevention.", similarity: 0.46, condition: "Tuberculosis", location: "Mumbai, India" },
  { id: 144, name: "Emily Sanders", bio: "COVID-19 long hauler, fatigue.", similarity: 0.45, condition: "COVID-19 Long Hauler", location: "Los Angeles, USA" },
  { id: 145, name: "Hassan Jamil", bio: "Liver cirrhosis, hopeful.", similarity: 0.44, condition: "Liver Cirrhosis", location: "Casablanca, Morocco" },
  { id: 146, name: "Maya Friedman", bio: "Epilepsy, med adjustment.", similarity: 0.43, condition: "Epilepsy", location: "Tel Aviv, Israel" },
  { id: 147, name: "Ben Huygens", bio: "Hemophilia, sports adaptation.", similarity: 0.42, condition: "Hemophilia", location: "Brussels, Belgium" },
  { id: 148, name: "Zara Qureshi", bio: "Psoriasis, topical therapy.", similarity: 0.41, condition: "Psoriasis", location: "Karachi, Pakistan" },
  { id: 149, name: "Tommy Larsen", bio: "Tourette, CBIT therapy.", similarity: 0.40, condition: "Tourette Syndrome", location: "Oslo, Norway" },
  { id: 150, name: "Helena Schmidt", bio: "Dyslexia, reading coach.", similarity: 0.39, condition: "Dyslexia", location: "Vienna, Austria" },
];

import React, { useState, useEffect } from "react";
import { User } from "lucide-react";

const API_BASE = "/api";



type ConnectProps = {
  connections: Connection[];
  setConnections: React.Dispatch<React.SetStateAction<Connection[]>>;
  handleConnect: (id: number) => void;
  connectedSuggestedIds: number[];
  handleConnectSuggested: (id: number) => void;
};

const Connect: React.FC<ConnectProps> = ({ connections, setConnections, connectedSuggestedIds, handleConnectSuggested }) => {
  // const [isLoading, setIsLoading] = useState(true); // Removed unused state
  const [suggested, setSuggested] = useState<SuggestedUser[]>([]);
  const [isLoadingSuggested, setIsLoadingSuggested] = useState(true);
  const [suggestedError, setSuggestedError] = useState<string | null>(null);

  useEffect(() => {
    fetchConnections();
    fetchSuggestedConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      const response = await fetch(`${API_BASE}/connections`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setConnections(data);
        } else {
          // fallback to mock data if backend returns empty
          setConnections(mockConnections);
        }
      } else {
        // fallback to mock data if backend fails
        setConnections(mockConnections);
      }
    } catch (error) {
      console.error('Failed to fetch connections:', error);
      // fallback to mock data if fetch throws
      setConnections(mockConnections);
    } finally {
      // setIsLoading(false); // Removed unused state
    }
  };

  // Placeholder: Replace userId with actual user id from auth/profile
  const fetchSuggestedConnections = async () => {
    setIsLoadingSuggested(true);
    setSuggestedError(null);
    try {
      // Replace with real API call when backend is ready
      // const response = await fetch(`${API_BASE}/recommendations/1`);
      // if (response.ok) {
      //   const data = await response.json();
      //   setSuggested(data);
      // }
      // Mock data for now
      // Use the exported mockSuggested array
      setTimeout(() => {
        setSuggested(mockSuggested);
        // --- MOCK DATA: 50+ diverse users for connections and suggestions ---
        // Removed redeclaration of mockConnections; use the top-level array


        setIsLoadingSuggested(false);
      }, 800);
    } catch (error) {
      setSuggestedError('Failed to fetch suggested connections.');
      setIsLoadingSuggested(false);
    }
  };

  const handleConnect = async (userId: number) => {
    try {
      const response = await fetch(`${API_BASE}/connect/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        setConnections(connections.map(connection =>
          connection.id === userId ? data.connection : connection
        ));
      } else {
        // If using mock data, update status locally
        setConnections(connections.map(connection =>
          connection.id === userId
            ? { ...connection, status: 'Connected' }
            : connection
        ));
      }
    } catch (error) {
      // If fetch fails (mock mode), update status locally
      setConnections(connections.map(connection =>
        connection.id === userId
          ? { ...connection, status: 'Connected' }
          : connection
      ));
      console.error('Failed to connect:', error);
    }
  };



  const [search, setSearch] = useState("");
  const [conditionFilter, setConditionFilter] = useState<string>("");
  const [activeTab, setActiveTab] = useState<'patients' | 'doctors'>('patients');

  // Collect all unique conditions/specialties from connections, suggested users, and doctors
  const allConditions = Array.from(new Set([
    ...connections.map(c => c.condition),
    ...suggested.map(s => s.condition),
    ...mockDoctors.map(d => d.specialty)
  ])).sort();

  // Filtered lists based on search and condition
  const filteredSuggested = suggested.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.condition.toLowerCase().includes(search.toLowerCase()) ||
      user.location.toLowerCase().includes(search.toLowerCase()) ||
      user.bio.toLowerCase().includes(search.toLowerCase());
    const matchesCondition = !conditionFilter || user.condition === conditionFilter;
    return matchesSearch && matchesCondition;
  });
  const filteredConnections = connections.filter(connection => {
    const matchesSearch =
      connection.name.toLowerCase().includes(search.toLowerCase()) ||
      connection.condition.toLowerCase().includes(search.toLowerCase()) ||
      connection.location.toLowerCase().includes(search.toLowerCase()) ||
      connection.journey.toLowerCase().includes(search.toLowerCase());
    const matchesCondition = !conditionFilter || connection.condition === conditionFilter;
    return matchesSearch && matchesCondition;
  });
  const filteredDoctors = mockDoctors.filter(doctor => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(search.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(search.toLowerCase()) ||
      doctor.location.toLowerCase().includes(search.toLowerCase()) ||
      doctor.bio.toLowerCase().includes(search.toLowerCase());
    const matchesCondition = !conditionFilter || doctor.specialty === conditionFilter;
    return matchesSearch && matchesCondition;
  });

  // Simulate AI-suggested doctors: pick top 2-3 relevant doctors based on filter (e.g., specialty matches conditionFilter or random if none)
  let aiSuggestedDoctors: Doctor[] = [];
  if (conditionFilter) {
    aiSuggestedDoctors = mockDoctors.filter(d => d.specialty === conditionFilter).slice(0, 3);
  }
  if (aiSuggestedDoctors.length === 0) {
    // fallback: pick 2 random doctors
    aiSuggestedDoctors = mockDoctors.slice(0, 2);
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Connect with Others</h2>

      {/* Unified Search Bar + Condition Filter */}
      <div className="mb-8 flex flex-col items-center">
        {/* Tabs */}
        <div className="flex mb-2 w-full md:w-2/3 justify-center bg-gray-100 rounded-t-xl shadow-sm overflow-hidden">
          <button
            className={`flex-1 px-6 py-3 font-semibold text-lg transition-all duration-150 border-b-4 focus:outline-none ${activeTab === 'patients' ? 'border-blue-600 text-blue-700 bg-white shadow-md z-10' : 'border-transparent text-gray-500 bg-gray-100 hover:text-blue-700 hover:bg-gray-50'}`}
            style={{borderTopLeftRadius: '0.75rem'}} // rounded-tl-xl
            onClick={() => setActiveTab('patients')}
            tabIndex={0}
          >
            Patients
          </button>
          <button
            className={`flex-1 px-6 py-3 font-semibold text-lg transition-all duration-150 border-b-4 focus:outline-none ${activeTab === 'doctors' ? 'border-blue-600 text-blue-700 bg-white shadow-md z-10' : 'border-transparent text-gray-500 bg-gray-100 hover:text-blue-700 hover:bg-gray-50'}`}
            style={{borderTopRightRadius: '0.75rem'}} // rounded-tr-xl
            onClick={() => setActiveTab('doctors')}
            tabIndex={0}
          >
            Doctors
          </button>
        </div>
        {/* Search Bar */}
        <div className="flex w-full md:w-2/3 bg-white border border-gray-200 rounded-b-xl rounded-t shadow-lg overflow-hidden mt-0">
          <input
            type="text"
            className="flex-1 px-5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 border-none bg-white placeholder-gray-400"
            placeholder={activeTab === 'patients' ? "Search by name, condition, location, or journey..." : "Search by name, specialty, location, or bio..."}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="px-5 py-3 border-l border-gray-100 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-base"
            value={conditionFilter}
            onChange={e => setConditionFilter(e.target.value)}
            style={{ minWidth: 180 }}
          >
            <option value="">All Conditions</option>
            {allConditions.map(cond => (
              <option key={cond} value={cond}>{cond}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'patients' ? (
        <>
          {/* Suggested Connections (AI-powered) */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold mb-3 text-blue-700">Suggested Connections (AI)</h3>
            {isLoadingSuggested ? (
              <div className="text-gray-500">Finding like-minded people...</div>
            ) : suggestedError ? (
              <div className="text-red-500">{suggestedError}</div>
            ) : filteredSuggested.length === 0 ? (
              <div className="text-gray-500">No suggestions at this time.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {filteredSuggested.map((user) => {
                  const isConnected = connectedSuggestedIds.includes(user.id);
                  // Generate a random image for each suggested user
                  const gender = Math.random() > 0.5 ? 'men' : 'women';
                  const imgId = Math.floor(Math.random() * 99);
                  return (
                    <div key={user.id} className="bg-blue-50 rounded-lg shadow p-6 border border-blue-200">
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3 overflow-hidden">
                          <img
                            src={`https://randomuser.me/api/portraits/${gender}/${imgId}.jpg`}
                            alt={user.name}
                            className="w-12 h-12 object-cover rounded-full"
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg flex items-center gap-2">
                            {user.name}
                            <span className="ml-1 px-2 py-0.5 text-xs rounded bg-green-100 text-green-700 font-semibold">Patient</span>
                          </h4>
                          <p className="text-gray-600 text-sm">{user.condition} • {user.location}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-2 italic">"{user.bio}"</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-blue-800 bg-blue-100 rounded px-2 py-1">Similarity: {(user.similarity * 100).toFixed(1)}%</span>
                        <button
                          className={`px-4 py-1 rounded ${isConnected ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                          onClick={() => handleConnectSuggested(user.id)}
                          disabled={isConnected}
                        >
                          {isConnected ? 'Connected' : 'Connect'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {/* Existing Connections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {filteredConnections.map((connection) => {
              // Generate a random image for each connection
              const gender = Math.random() > 0.5 ? 'men' : 'women';
              const imgId = Math.floor(Math.random() * 99);
              return (
                <div key={connection.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mr-4 overflow-hidden">
                      <img
                        src={`https://randomuser.me/api/portraits/${gender}/${imgId}.jpg`}
                        alt={connection.name}
                        className="w-16 h-16 object-cover rounded-full"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        {connection.name}
                        <span className="ml-1 px-2 py-0.5 text-xs rounded bg-green-100 text-green-700 font-semibold">Patient</span>
                      </h3>
                      <p className="text-gray-600">{connection.condition}</p>
                      <p className="text-sm text-gray-500">{connection.location}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {connection.journey}
                    </span>
                  </div>
                  <p className="text-green-600 font-medium mb-4">{connection.status}</p>
                  <button
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={() => handleConnect(connection.id)}
                  >
                    {connection.status === "Connected" ? "Message" : "Connect"}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          {/* AI-Suggested Doctors Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3 text-purple-700">AI-Suggested Doctors</h3>
            {aiSuggestedDoctors.length === 0 ? (
              <div className="text-gray-500">No AI-suggested doctors found for your profile/filter.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {aiSuggestedDoctors.map((doctor) => {
                  const gender = Math.random() > 0.5 ? 'men' : 'women';
                  const imgId = Math.floor(Math.random() * 99);
                  return (
                    <div key={doctor.id} className="bg-purple-50 rounded-lg shadow p-6 border border-purple-200">
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-3 overflow-hidden">
                          <img
                            src={`https://randomuser.me/api/portraits/${gender}/${imgId}.jpg`}
                            alt={doctor.name}
                            className="w-12 h-12 object-cover rounded-full"
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg flex items-center gap-2">
                            {doctor.name}
                            <span className="ml-1 px-2 py-0.5 text-xs rounded bg-purple-200 text-purple-800 font-semibold">Doctor</span>
                          </h4>
                          <p className="text-gray-600 text-sm">{doctor.specialty} • {doctor.location}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-2 italic">"{doctor.bio}"</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {/* Doctors Section (separate from patients) */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold mb-3 text-blue-700">Find a Doctor</h3>
            {filteredDoctors.length === 0 ? (
              <div className="text-gray-500">No doctors found for your search/filter.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {filteredDoctors.map((doctor) => {
                  const gender = Math.random() > 0.5 ? 'men' : 'women';
                  const imgId = Math.floor(Math.random() * 99);
                  return (
                    <div key={doctor.id} className="bg-yellow-50 rounded-lg shadow p-6 border border-yellow-200">
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-3 overflow-hidden">
                          <img
                            src={`https://randomuser.me/api/portraits/${gender}/${imgId}.jpg`}
                            alt={doctor.name}
                            className="w-12 h-12 object-cover rounded-full"
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg flex items-center gap-2">
                            {doctor.name}
                            <span className="ml-1 px-2 py-0.5 text-xs rounded bg-yellow-200 text-yellow-800 font-semibold">Doctor</span>
                          </h4>
                          <p className="text-gray-600 text-sm">{doctor.specialty} • {doctor.location}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-2 italic">"{doctor.bio}"</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Connect;