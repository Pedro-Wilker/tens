import { Header } from "./components/header";


export default function DashBoard({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      
      {children}
    </div>
  );
}