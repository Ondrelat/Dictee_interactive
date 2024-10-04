// Footer.tsx
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-4 mt-auto">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div>
          <p>&copy; {new Date().getFullYear()} Dictée intéractive.</p>
        </div>
        <div>
          <Link href="https://discord.gg/6uWrYH6s" target="_blank" rel="noopener noreferrer">
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
    </footer>
  );
};

export default Footer;