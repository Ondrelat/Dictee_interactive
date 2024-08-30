
import './contact.css';
import Link from 'next/link';
import Image from 'next/image';

export default async function Home() {

  return (
    <div className="page-container">
      <div className="email-container">
        <p className="text">Pour me contacter, envoyez-moi un mail :</p>
        <p className="email">Dictee.Interactive@gmail.com</p>
      </div>
      <div className="mt-4 flex justify-center">
        Mais si tu veux avoir plus de chances que je réponde, rejoins-moi sur Discord.
        <Link href="https://discord.gg/dftkVKGx" target="_blank" rel="noopener noreferrer">
          <div className="relative w-[30px] h-[30px]">
            <Image
              src="/discord-logo_3.png"
              alt="Logo Discord"
              layout="fill"
              objectFit="contain"
              className="bg-gray-900"
            />
          </div>
        </Link>
      </div>
    </div>
  );
}
