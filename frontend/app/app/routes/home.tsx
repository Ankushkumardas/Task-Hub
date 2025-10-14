import { Card, CardContent } from "~/components/ui/card";
import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Task Manager " },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div>
      Home Page
      
    </div>
  );
}
