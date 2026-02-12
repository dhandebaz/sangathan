import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact - Sangathan',
  description: 'Get in touch with the Sangathan team.',
}

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
      
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <form className="space-y-6">
           <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input type="text" className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-orange-500" required />
           </div>
           <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-orange-500" required />
           </div>
           <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea rows={5} className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-orange-500" required></textarea>
           </div>
           <button className="w-full bg-black text-white py-3 rounded-lg font-bold hover:opacity-90">Send Message</button>
        </form>
        <p className="mt-4 text-xs text-center text-gray-400">
           For urgent inquiries, email support@sangathan.app
        </p>
      </div>
    </div>
  )
}
