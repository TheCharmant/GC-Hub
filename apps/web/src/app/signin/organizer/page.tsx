import LoginForm from "@/app/components/LoginForm";

export default function OrganizerLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#7a8c9e] to-[#a8a4c5] flex items-center justify-center p-4">
      <LoginForm role="Organizer" fieldLabel="Organizer ID" />
    </div>
  );
}