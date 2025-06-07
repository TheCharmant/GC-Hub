import Image from "next/image";
import Link from "next/link";
import GetStartedButton from "./components/GetStartedButton";
import RoleSelectionCards from "./components/RoleSelectionCards";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#faf7ef]">
      {/* Navigation */}
      <nav className="bg-[#faf7ef] p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Image src="/gc-hub-logo.svg" alt="GC Hub Logo" width={100} height={40} />
        </div>
        <div className="flex gap-8">
          <Link href="#features" className="text-gray-700 hover:text-gray-900">FEATURES</Link>
          <Link href="#how-it-works" className="text-gray-700 hover:text-gray-900">HOW IT WORKS</Link>
          <Link href="#faq" className="text-gray-700 hover:text-gray-900">FAQ</Link>
          <Link href="#contact" className="text-gray-700 hover:text-gray-900">CONTACT</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#7a8c9e] to-[#a8a4c5] py-20">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              GC Hub — Connecting Students, Empowering Leaders.
            </h1>
            <p className="text-white text-lg mb-8">
              All-in-One Platform for School Clubs, Events, and Volunteer Tracking for Gordon College
            </p>
            <div className="flex gap-4">
              <GetStartedButton />
              <button className="bg-purple-500 text-white px-6 py-3 rounded-md font-medium">
                Learn More
              </button>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <Image 
              src="/dashboard-preview.png" 
              alt="GC Hub Dashboard" 
              width={500} 
              height={400}
              className="rounded-lg shadow-xl"
            />
            <div className="absolute -bottom-10 -left-10 rotate-6">
              <Image 
                src="/gc-hub-icon.png" 
                alt="GC Hub Icon" 
                width={150} 
                height={150}
                className="rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Login/Signup Section */}
      <section id="login-signup" className="py-16 bg-[#faf7ef]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-purple-600 mb-4">Login/Signup</h2>
          <p className="text-gray-600 mb-10">To continue choose role...</p>
          
          <RoleSelectionCards />
        </div>
      </section>

      {/* Why Choose Our App Section */}
      <section id="features" className="py-16 bg-[#faf7ef]">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-purple-600 mb-16">Why Choose Our App</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Centralized Management</h3>
              <p className="text-gray-600 mb-8">
                Manage clubs, events, and volunteers in one place—no need for multiple tools.
              </p>
              <Image 
                src="/centralized-management.png" 
                alt="Centralized Management" 
                width={300} 
                height={200}
                className="rounded-md"
              />
            </div>
            
            {/* Card 2 */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Automated and Secure</h3>
              <p className="text-gray-600 mb-8">
                Track attendance and verify participation with built-in AI and secure user roles.
              </p>
              <Image 
                src="/automated-secure.png" 
                alt="Automated and Secure" 
                width={300} 
                height={200}
                className="rounded-md"
              />
            </div>
            
            {/* Card 3 */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Clear Reports and Insights</h3>
              <p className="text-gray-600 mb-8">
                View real-time updates on successful payments, refunds, and other transaction-related activities
              </p>
              <Image 
                src="/reports-insights.png" 
                alt="Reports and Insights" 
                width={300} 
                height={200}
                className="rounded-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-16 bg-[#faf7ef]">
        <div className="container mx-auto px-6 relative">
          <div className="absolute top-0 right-0">
            <div className="w-32 h-24 bg-[#7a8c9e] rounded-md transform rotate-12"></div>
          </div>
          
          <h2 className="text-4xl font-bold text-purple-600 mb-16">How it works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex gap-4">
              <div className="text-purple-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">User Registration & Role Assignment</h3>
                <p className="text-gray-600">
                  Students, organizers, and club leaders sign up and are granted role-based access.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="text-purple-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Attendance & Proof Submission</h3>
                <p className="text-gray-600">
                  Volunteers mark attendance and upload proof (photos, certificates), which the system verifies using AI (OCR & image recognition).
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="text-purple-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Event Creation & Volunteer Enrollment</h3>
                <p className="text-gray-600">
                  Organizers and leaders create events and manage volunteer sign-ups directly through the platform.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="text-purple-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Engagement Tracking & Reporting</h3>
                <p className="text-gray-600">
                  The platform records attendance, tracks volunteer hours, and generates reports via a visual dashboard for both students and administrators.
                </p>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0">
            <div className="w-32 h-24 bg-[#7a8c9e] rounded-md transform -rotate-12"></div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-[#faf7ef]">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-purple-600 mb-16">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Who can use GC Hub?</h3>
              <p className="text-gray-600">
                GC Hub is designed for school administrators, club leaders, and student volunteers—all with specific access based on their role to ensure secure and efficient management.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">What makes GC Hub different from other existing system?</h3>
              <p className="text-gray-600">
                Unlike scattered social media updates or manual logs, GC Hub offers a centralized platform with real-time notifications, automated tracking, and reliable data reporting—all in a lightweight, user-friendly interface.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">How is volunteer participation verified?</h3>
              <p className="text-gray-600">
                Volunteers upload proof of attendance (e.g., certificates or event photos), which is automatically validated using AI tools like OCR and image recognition.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Is GC Hub accessible on mobile devices?</h3>
              <p className="text-gray-600">
                Volunteers upload proof of attendance (e.g., certificates or event photos), which is automatically validated using AI tools like OCR and image recognition.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[#7a8c9e] text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="mb-4">© 2025 GC Hub. All Rights Reserved. Brand, Inc.</p>
          <div className="flex justify-center gap-4">
            <Link href="/about" className="hover:underline">About us</Link>
            <span>•</span>
            <Link href="/terms" className="hover:underline">Terms & Privacy</Link>
            <span>•</span>
            <Link href="/contact" className="hover:underline">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}








