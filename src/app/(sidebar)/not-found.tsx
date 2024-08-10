import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center flex-col">
      <p className="text-4xl">Not found – 404!</p>
        <div>
          <Link className="hover:underline text-[#1DB954]" href="/">Go back to Home</Link>
        </div>
    </div>
  )
}