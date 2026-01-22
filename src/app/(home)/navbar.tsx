import Link from "next/link";
import Image from "next/image";
import { UserButton, OrganizationSwitcher } from "@clerk/nextjs";
import { SearchInput } from "./search-input";

// OrganizationSwitcher の属性
// - organization の切り替えをしたときに開いているドキュメントを開き続けられないよう、
//   ホームにリダイレクトする

export const Navbar = () => {
  return (
    <nav className="flex items-center justify-between h-full w-full">
      <div className="flex gap-3 items-center shrink-0 pr-6">
        <Link href="/">
          <Image src="/logo.svg" alt="Logo" width={36} height={36} />
        </Link>
        <h3 className="text-xl">Docs</h3>
      </div>

      {/* 検索窓 */}
      <SearchInput />

      <div className="flex gap-3 items-center pl-6">
        {/* organization or personal */}
        <OrganizationSwitcher
          afterCreateOrganizationUrl="/"
          afterLeaveOrganizationUrl="/"
          afterSelectOrganizationUrl="/"
          afterSelectPersonalUrl="/"
        />
        {/* ユーザーアイコン、ユーザー情報を確認できる */}
        <UserButton />
      </div>
    </nav>
  );
};
