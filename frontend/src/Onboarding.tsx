import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const steps = [
    "Patient Information",
    "Medical History",
    "Lifestyle Assessment",
    "Goals & Expectations",
    "Review & Submit"
];


const initialForm = {
    name: "",
    age: "",
    gender: "",
    countryCode: "",
    phoneNumber: "",
    conditions: "",
    allergies: "",
    medications: "",
    exercise: "",
    diet: "",
    mentalHealth: "",
    goals: "",
    expectations: ""
};

type FormType = typeof initialForm;


const Onboarding: React.FC = () => {
    const [step, setStep] = useState(0);
    const [form, setForm] = useState<FormType>(initialForm);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const navigate = useNavigate();


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };



    // Validation logic for each step
    const validateStep = () => {
        let newErrors: { [key: string]: string } = {};
        if (step === 0) {
            if (!form.name.trim()) newErrors.name = "Name is required.";
            if (!form.age.trim() || isNaN(Number(form.age)) || Number(form.age) <= 0) newErrors.age = "Valid age is required.";
            if (!form.gender.trim()) newErrors.gender = "Gender is required.";
            // Contact validation: require country code and phone number, validate format
            if (!form.countryCode.trim()) {
                newErrors.countryCode = "Country code is required.";
            } else if (!/^\+\d{1,4}$/.test(form.countryCode.trim())) {
                newErrors.countryCode = "Country code must be in format +123.";
            }
            if (!form.phoneNumber.trim()) {
                newErrors.phoneNumber = "Phone number is required.";
            } else if (!/^\d{7,15}$/.test(form.phoneNumber.trim())) {
                newErrors.phoneNumber = "Phone number must be 7-15 digits.";
            }
        }
        // No required fields for step 1, 2, 3 (optional, but you can add if needed)
        // Example: require at least one field in step 1
        if (step === 1) {
            if (!form.conditions.trim() && !form.allergies.trim() && !form.medications.trim()) {
                newErrors.conditions = "Please provide at least one medical history detail.";
            }
        }
        if (step === 2) {
            if (!form.exercise.trim() && !form.diet.trim() && !form.mentalHealth.trim()) {
                newErrors.exercise = "Please provide at least one lifestyle detail.";
            }
        }
        if (step === 3) {
            if (!form.goals.trim()) newErrors.goals = "Please enter your goals.";
            if (!form.expectations.trim()) newErrors.expectations = "Please enter your expectations.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const next = () => {
        if (validateStep()) setStep((s) => Math.min(s + 1, steps.length - 1));
    };
    const back = () => setStep((s) => Math.max(s - 1, 0));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep()) return;
        setSubmitted(true);
        // TODO: send form data to backend
        // Show GIF and message for 2.5 seconds, then redirect
        setTimeout(() => {
            navigate("/dashboard");
        }, 3000);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 p-6">
            <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8">
                {/* Progress Indicator */}
                <div className="flex items-center mb-8">
                    {steps.map((label, idx) => (
                        <React.Fragment key={label}>
                            <div className={`flex-1 h-2 rounded-full ${idx <= step ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                            {idx < steps.length - 1 && <div className="w-6 h-2" />}
                        </React.Fragment>
                    ))}
                </div>
                <h2 className="text-2xl font-bold mb-4 text-blue-700 text-center">{steps[step]}</h2>
                {!submitted ? (
                    <form onSubmit={handleSubmit}>
                        {/* Step 1: Patient Information */}
                        {step === 0 && (
                            <div className="space-y-4">
                                <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" className={`w-full px-4 py-2 border rounded ${errors.name ? 'border-red-400' : ''}`} />
                                {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
                                <input name="age" value={form.age} onChange={handleChange} placeholder="Age" type="number" className={`w-full px-4 py-2 border rounded ${errors.age ? 'border-red-400' : ''}`} />
                                {errors.age && <div className="text-red-500 text-sm">{errors.age}</div>}
                                <select name="gender" value={form.gender} onChange={handleChange} className={`w-full px-4 py-2 border rounded ${errors.gender ? 'border-red-400' : ''}`} >
                                    <option value="">Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                {errors.gender && <div className="text-red-500 text-sm">{errors.gender}</div>}
                                <div className="flex gap-2">
                                    <input
                                        name="countryCode"
                                        value={form.countryCode}
                                        onChange={handleChange}
                                        placeholder="Country Code (e.g. +1)"
                                        className={`w-1/3 px-4 py-2 border rounded ${errors.countryCode ? 'border-red-400' : ''}`}
                                    />
                                    <input
                                        name="phoneNumber"
                                        value={form.phoneNumber}
                                        onChange={handleChange}
                                        placeholder="Phone Number"
                                        className={`w-2/3 px-4 py-2 border rounded ${errors.phoneNumber ? 'border-red-400' : ''}`}
                                    />
                                </div>
                                {errors.countryCode && <div className="text-red-500 text-sm">{errors.countryCode}</div>}
                                {errors.phoneNumber && <div className="text-red-500 text-sm">{errors.phoneNumber}</div>}
                            </div>
                        )}
                        {/* Step 2: Medical History */}
                        {step === 1 && (
                            <div className="space-y-4">
                                <textarea name="conditions" value={form.conditions} onChange={handleChange} placeholder="Pre-existing Conditions" className={`w-full px-4 py-2 border rounded ${errors.conditions ? 'border-red-400' : ''}`} />
                                <textarea name="allergies" value={form.allergies} onChange={handleChange} placeholder="Allergies" className="w-full px-4 py-2 border rounded" />
                                <textarea name="medications" value={form.medications} onChange={handleChange} placeholder="Current Medications" className="w-full px-4 py-2 border rounded" />
                                {errors.conditions && <div className="text-red-500 text-sm">{errors.conditions}</div>}
                            </div>
                        )}
                        {/* Step 3: Lifestyle Assessment */}
                        {step === 2 && (
                            <div className="space-y-4">
                                <textarea name="exercise" value={form.exercise} onChange={handleChange} placeholder="Exercise Habits" className={`w-full px-4 py-2 border rounded ${errors.exercise ? 'border-red-400' : ''}`} />
                                <textarea name="diet" value={form.diet} onChange={handleChange} placeholder="Diet" className="w-full px-4 py-2 border rounded" />
                                <textarea name="mentalHealth" value={form.mentalHealth} onChange={handleChange} placeholder="Mental Health" className="w-full px-4 py-2 border rounded" />
                                {errors.exercise && <div className="text-red-500 text-sm">{errors.exercise}</div>}
                            </div>
                        )}
                        {/* Step 4: Goals and Expectations */}
                        {step === 3 && (
                            <div className="space-y-4">
                                <textarea name="goals" value={form.goals} onChange={handleChange} placeholder="Your Goals" className={`w-full px-4 py-2 border rounded ${errors.goals ? 'border-red-400' : ''}`} />
                                {errors.goals && <div className="text-red-500 text-sm">{errors.goals}</div>}
                                <textarea name="expectations" value={form.expectations} onChange={handleChange} placeholder="Expectations from the App" className={`w-full px-4 py-2 border rounded ${errors.expectations ? 'border-red-400' : ''}`} />
                                {errors.expectations && <div className="text-red-500 text-sm">{errors.expectations}</div>}
                            </div>
                        )}
                        {/* Step 5: Review and Submit */}
                        {step === 4 && (
                            <div className="space-y-2 text-left text-gray-700">
                                <div><b>Name:</b> {form.name}</div>
                                <div><b>Age:</b> {form.age}</div>
                                <div><b>Gender:</b> {form.gender}</div>
                                <div><b>Contact:</b> {form.countryCode} {form.phoneNumber}</div>
                                <div><b>Conditions:</b> {form.conditions}</div>
                                <div><b>Allergies:</b> {form.allergies}</div>
                                <div><b>Medications:</b> {form.medications}</div>
                                <div><b>Exercise:</b> {form.exercise}</div>
                                <div><b>Diet:</b> {form.diet}</div>
                                <div><b>Mental Health:</b> {form.mentalHealth}</div>
                                <div><b>Goals:</b> {form.goals}</div>
                                <div><b>Expectations:</b> {form.expectations}</div>
                            </div>
                        )}
                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8">
                            <button type="button" onClick={back} disabled={step === 0} className="px-6 py-2 rounded bg-gray-200 text-gray-700 font-semibold disabled:opacity-50">Back</button>
                            {step < steps.length - 1 ? (
                                <button type="button" onClick={next} className="px-6 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700">Next</button>
                            ) : (
                                <button type="submit" className="px-6 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700">Submit</button>
                            )}
                        </div>
                    </form>
                ) : (
                    <div className="mt-6 flex flex-col items-center justify-center">
                        <img
                            src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExb2Z2b2J2d3Z2b2J2b2Z2b2J2b2Z2b2J2b2Z2b2J2b2Z2b2J2/g7sQ2vY3y7hM4/giphy.gif"
                            alt="Formulating your solution"
                            className="w-40 h-40 object-contain mb-4"
                        />
                        <div className="text-blue-700 font-semibold text-center text-lg">
                            We are formulating your requirements and building your personalized solution...
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Onboarding;
