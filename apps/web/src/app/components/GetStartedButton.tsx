'use client'

export default function GetStartedButton() {
  return (
    <button 
      className="bg-white text-purple-600 px-6 py-3 rounded-md font-medium"
      onClick={() => document.getElementById('login-signup')?.scrollIntoView({ behavior: 'smooth' })}
    >
      Get Started
    </button>
  );
}