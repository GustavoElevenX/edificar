"use client";

import { LogOut, Menu, UserRound, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";

const navItems = [
  { href: "/", label: "Início" },
  { href: "/momento", label: "Meu Momento" },
  { href: "/caminhos", label: "Caminhos" },
  { href: "/receber-diario", label: "Receber Diário" },
  { href: "/apoiar", label: "Apoiar a Missão" }
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { loading, user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
    router.push("/login");
  };

  return (
    <header className="site-header">
      <Link className="brand" href="/" onClick={() => setOpen(false)}>
        <Image
          className="brand-logo"
          src="/edificar-logo.png"
          width={38}
          height={38}
          alt=""
          priority
        />
        <span>Edificar</span>
      </Link>

      <button
        className="icon-button menu-button"
        type="button"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        title={open ? "Fechar menu" : "Abrir menu"}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      <nav className={open ? "nav open" : "nav"} aria-label="Navegação principal">
        {(user ? navItems : navItems.slice(0, 1)).map((item) => (
          <Link
            key={item.href}
            className={pathname === item.href ? "nav-link active" : "nav-link"}
            href={item.href}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="auth-actions">
        {loading ? null : user ? (
          <>
            <span className="user-pill" title={user.email ?? "Usuário conectado"}>
              <UserRound size={16} />
              <span>{user.user_metadata?.name ?? user.email}</span>
            </span>
            <button
              className="icon-button"
              type="button"
              onClick={handleSignOut}
              aria-label="Sair"
              title="Sair"
            >
              <LogOut size={18} />
            </button>
          </>
        ) : (
          <>
            <Link className="nav-link" href="/login">
              Entrar
            </Link>
            <Link className="button small" href="/registro">
              Criar conta
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
