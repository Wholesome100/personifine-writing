import Link from "next/link";

export default function Header() {
  return (
    <header>
      <div>
        <h1>Personifine</h1>
        <ul>
          <li>
            <Link href="/">Catalog</Link>
          </li>
          <li>
            <Link href="/">Authorship</Link>
          </li>
          <li>
            <Link href="/">About</Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
