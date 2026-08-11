import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-6 bg-black px-6 text-center text-white">
      <span className="text-6xl font-light text-[#FF4D00]">404</span>
      <h1 className="text-2xl font-light tracking-widest text-zinc-200 uppercase">
        Page Not Found
      </h1>
      <p className="max-w-sm text-xs leading-relaxed font-light text-zinc-500">
        The detailing resource or page you requested could not be located.
      </p>
      <Link
        href="/"
        className="rounded bg-[#FF4D00] px-6 py-3 text-[10px] font-bold tracking-widest text-black uppercase transition-colors hover:bg-[#FF4D00]/90"
      >
        Return Home
      </Link>
    </div>
  );
}
