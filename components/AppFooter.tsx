export default function AppFooter() {
  return (
    <footer className="bg-[#050303] w-full py-12 mt-auto border-t border-white/5">
      <div className="flex flex-col md:flex-row justify-between items-center px-12 max-w-screen-2xl mx-auto w-full">
        <div className="flex flex-col items-center md:items-start mb-8 md:mb-0">
          <span className="text-lg font-bold text-stone-200 mb-2 font-mono uppercase tracking-widest">
            ForgeX | CMR Institute of Technology
          </span>
          <p className="text-stone-500 font-mono text-[10px] uppercase tracking-widest">
            © 2026 FoodShield Command. All rights reserved.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          <a className="text-stone-500 font-mono text-[10px] uppercase tracking-widest hover:text-red-400 transition-colors opacity-80 hover:opacity-100" href="#">Security</a>
          <a className="text-stone-500 font-mono text-[10px] uppercase tracking-widest hover:text-red-400 transition-colors opacity-80 hover:opacity-100" href="#">Privacy</a>
          <a className="text-stone-500 font-mono text-[10px] uppercase tracking-widest hover:text-red-400 transition-colors opacity-80 hover:opacity-100" href="#">Terms</a>
          <a className="text-stone-500 font-mono text-[10px] uppercase tracking-widest hover:text-red-400 transition-colors opacity-80 hover:opacity-100" href="#">Support</a>
        </div>
      </div>
    </footer>
  );
}
