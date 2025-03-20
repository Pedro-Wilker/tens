import { Header } from "./components/header";


export default function UserDetailLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}