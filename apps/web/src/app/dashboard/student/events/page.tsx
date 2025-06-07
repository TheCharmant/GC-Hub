import Link from 'next/link'
import Image from 'next/image'

export default function StudentEvents() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Events</h1>
        <p className="text-gray-600">Browse all events from clubs and organizations</p>
      </div>
      
      <div className="mb-4 flex justify-between items-center">
        <div className="flex space-x-2">
          <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
            All Events
          </button>
          <button className="bg-white text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors">
            My Clubs
          </button>
          <button className="bg-white text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors">
            Recommended
          </button>
        </div>
        <div className="w-64">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="absolute right-3 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Event Card 1 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-2">GC CCS Techfest</h2>
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <div className="flex items-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Date Posted: March 10, 2025</span>
              </div>
            </div>
            <div className="flex items-center mb-4">
              <div className="w-6 h-6 rounded-full bg-gray-200 mr-2 overflow-hidden">
                <Image src="/placeholder-club.png" alt="GC CCS Student Council" width={24} height={24} />
              </div>
              <span className="text-sm">GC CCS Student Council</span>
            </div>
            <p className="text-gray-600 mb-4">
              An annual event dedicated to fostering innovation, collaboration, and technical excellence through a series of seminars, coding competitions, workshops, and interactive activities tailored for Computer Science students.
            </p>
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <span>John Jacob Smith | Student Council PIO</span>
              </div>
            </div>
            <div className="h-48 bg-gray-100 mb-4 flex items-center justify-center rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <button className="text-gray-500 hover:text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                  </button>
                  <span>10</span>
                </div>
                <div className="flex items-center">
                  <button className="text-gray-500 hover:text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h-2" />
                    </svg>
                  </button>
                  <span>0</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="bg-purple-600 text-white px-4 py-1 rounded-md text-sm hover:bg-purple-700 transition-colors">
                  Register
                </button>
                <Link href="/events/1" className="bg-gray-700 text-white px-4 py-1 rounded-md text-sm hover:bg-gray-800 transition-colors">
                  See more
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Event Card 2 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-2">Gordon College Sports Fest</h2>
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <div className="flex items-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Date Posted: March 10, 2025</span>
              </div>
            </div>
            <div className="flex items-center mb-4">
              <div className="w-6 h-6 rounded-full bg-gray-200 mr-2 overflow-hidden">
                <Image src="/placeholder-club.png" alt="GC Student Council" width={24} height={24} />
              </div>
              <span className="text-sm">GC Student Council</span>
            </div>
            <p className="text-gray-600 mb-4">
              An annual event dedicated to fostering innovation, collaboration, and technical excellence through a series of seminars, coding competitions, workshops, and interactive activities tailored for Computer Science students.
            </p>
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <span>John Jacob Smith | Student Council PIO</span>
              </div>
            </div>
            <div className="h-48 bg-gray-100 mb-4 flex items-center justify-center rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <button className="text-gray-500 hover:text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                  </button>
                  <span>10</span>
                </div>
                <div className="flex items-center">
                  <button className="text-gray-500 hover:text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h-2" />
                    </svg>
                  </button>
                  <span>0</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="bg-purple-600 text-white px-4 py-1 rounded-md text-sm hover:bg-purple-700 transition-colors">
                  Register
                </button>
                <Link href="/events/2" className="bg-gray-700 text-white px-4 py-1 rounded-md text-sm hover:bg-gray-800 transition-colors">
                  See more
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Event Card 3 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-2">GC Founding Anniversary</h2>
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <div className="flex items-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Date Posted: March 10, 2025</span>
              </div>
            </div>
            <div className="flex items-center mb-4">
              <div className="w-6 h-6 rounded-full bg-gray-200 mr-2 overflow-hidden">
                <Image src="/placeholder-club.png" alt="GC Student Council" width={24} height={24} />
              </div>
              <span className="text-sm">GC Student Council</span>
            </div>
            <p className="text-gray-600 mb-4">
              An annual event dedicated to fostering innovation, collaboration, and technical excellence through a series of seminars, coding competitions, workshops, and interactive activities tailored for Computer Science students.
            </p>
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <span>John Jacob Smith | Student Council PIO</span>
              </div>
            </div>
            <div className="h-48 bg-gray-100 mb-4 flex items-center justify-center rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <button className="text-gray-500 hover:text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                  </button>
                  <span>10</span>
                </div>
                <div className="flex items-center">
                  <button className="text-gray-500 hover:text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h-2" />
                    </svg>
                  </button>
                  <span>0</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="bg-purple-600 text-white px-4 py-1 rounded-md text-sm hover:bg-purple-700 transition-colors">
                  Register
                </button>
                <Link href="/events/3" className="bg-gray-700 text-white px-4 py-1 rounded-md text-sm hover:bg-gray-800 transition-colors">
                  See more
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
