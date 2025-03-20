export function Card({ children }) {
    return <div className="border rounded-md p-4 shadow-sm">{children}</div>;
  }
  
  export function CardContent({ children }) {
    return <div className="p-2">{children}</div>;
  }
  