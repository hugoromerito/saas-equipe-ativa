import { Phone } from 'lucide-react'

export default function WhatsappButton() {
  return (
    <a
      href="https://wa.me/5521983327985" // Substitua pelo seu número
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed right-8 bottom-8 z-50 flex h-14 w-14 items-center overflow-hidden rounded-full bg-green-500 text-white shadow-lg transition-all duration-300 ease-in-out hover:w-40"
    >
      <div className="flex h-14 w-14 items-center justify-center">
        <Phone size={24} />
      </div>
      <span className="ml-2 hidden whitespace-nowrap transition-opacity duration-300 ease-in-out group-hover:flex">
        Suporte
      </span>
    </a>
  )
}
