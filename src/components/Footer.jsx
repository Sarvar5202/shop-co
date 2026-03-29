export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-16">
      <div className="bg-black rounded-2xl mx-4 md:mx-8 my-8 px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <h2 className="text-white text-2xl md:text-3xl font-black uppercase leading-tight max-w-xs">
          Stay Upto Date About Our Latest Offers
        </h2>
        <div className="flex flex-col gap-3 w-full md:w-72">
          <div className="flex items-center bg-white rounded-full px-4 py-3 gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="3" width="14" height="10" rx="2" stroke="#9CA3AF" strokeWidth="1.2"/>
              <path d="M1 5l7 5 7-5" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <input type="email" placeholder="Enter your email address" className="outline-none text-sm w-full text-gray-700 placeholder-gray-400"/>
          </div>
          <button className="bg-white text-black font-semibold rounded-full py-3 px-6 text-sm hover:bg-gray-100 transition">
            Subscribe to Newsletter
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2 md:col-span-1">
          <h3 className="text-xl font-black mb-3">SHOP.CO</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            We have clothes that suits your style and which you're proud to wear. From women to men.
          </p>
          <div className="flex gap-3 mt-4">
            <a href="#" className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:bg-black hover:border-black transition group">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-white stroke-gray-700"/></svg>
            </a>
            <a href="#" className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:bg-black hover:border-black transition group">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-white stroke-gray-700"/></svg>
            </a>
            <a href="#" className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:bg-black hover:border-black transition group">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.5" className="group-hover:stroke-white stroke-gray-700"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" className="group-hover:stroke-white stroke-gray-700"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" className="group-hover:fill-white fill-gray-700"/></svg>
            </a>
            <a href="#" className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:bg-black hover:border-black transition group">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-white stroke-gray-700"/></svg>
            </a>
          </div>
        </div>

        {[
          { title: "COMPANY", links: ["About", "Features", "Works", "Career"] },
          { title: "HELP", links: ["Customer Support", "Delivery Details", "Terms & Conditions", "Privacy Policy"] },
          { title: "FAQ", links: ["Account", "Manage Deliveries", "Orders", "Payments"] },
          { title: "RESOURCES", links: ["Free eBooks", "Development Tutorial", "How to - Blog", "Youtube Playlist"] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="font-bold text-sm mb-4 tracking-wider">{col.title}</h4>
            <ul className="flex flex-col gap-3">
              {col.links.map((link) => (
                <li key={link}><a href="#" className="text-gray-500 text-sm hover:text-black transition">{link}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 px-4 md:px-8 py-4 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <p className="text-gray-400 text-xs">Shop.co © 2000-2023. All Rights Reserved</p>
        <div className="flex items-center gap-2 flex-wrap">
          {["VISA", "MC", "PayPal", "Pay", "GPay"].map((p) => (
            <span key={p} className="text-xs text-gray-500 font-medium px-2 py-1 border border-gray-200 rounded-md">{p}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}
