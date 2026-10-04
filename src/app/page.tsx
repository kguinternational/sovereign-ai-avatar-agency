import Link from "next/link";
import { BookOpen, UserCircle, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <main className="max-w-4xl w-full flex flex-col items-center text-center space-y-12">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900">
            Welcome to <span className="text-blue-600">Alpha School</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Experience the <span className="font-semibold text-blue-600">TimeBack</span> model. Crush academics in 2 hours with adaptive apps, then spend the rest of the day on real-world skills and passions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 w-full max-w-3xl">
          <Link href="/student" className="group block">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col items-center space-y-4">
              <div className="bg-blue-100 p-4 rounded-full text-blue-600 group-hover:scale-110 transition-transform">
                <BookOpen size={40} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Student Portal</h2>
              <p className="text-gray-500">Access your adaptive mastery assessments and TimeBack life skills tracker.</p>
              <div className="flex items-center text-blue-600 font-semibold mt-4">
                Enter Portal <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </div>
          </Link>

          <Link href="/guide" className="group block">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col items-center space-y-4">
              <div className="bg-emerald-100 p-4 rounded-full text-emerald-600 group-hover:scale-110 transition-transform">
                <UserCircle size={40} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Guide Portal</h2>
              <p className="text-gray-500">Access the Incept Dashboard to monitor engagement and facilitate Limitless Meetings.</p>
              <div className="flex items-center text-emerald-600 font-semibold mt-4">
                Enter Portal <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
