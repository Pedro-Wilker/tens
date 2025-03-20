import {Header} from './components/header';


export default function AllServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      
      {children}
    </div>
  );
}