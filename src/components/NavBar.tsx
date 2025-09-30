import { ThemeToggle } from "./ThemeToggle";
import Link from "next/link";

const navItems = [
  { href: "/sounds", label: "Sounds" },
  { href: "/about", label: "About" },
  { href: "/register", label: "Sign Up" },
];

export default function NavBar() {
  return (
    <nav className="mx-40 mt-4 p-4 flex justify-between items-center bg-transparent ">
      <Link href="/" className="text-lg font-bold">
        <h1>Hotcue Sounds</h1>
      </Link>
      <div className="flex items-center space-x-4">
        {navItems.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
        <ThemeToggle/>
      </div>
    </nav>
  );
}

function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors"
    >
      {label}
    </Link>
  )
}
