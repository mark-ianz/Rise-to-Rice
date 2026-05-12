import { cn } from "@/lib/utils";

type Props = {
  error: string[] | null;
  className?: string;
};

export default function ZodErrorDisplay({ error, className }: Props) {
  return (
    error &&
    error.length > 0 && (
      <ul className={cn("rounded-md text-destructive text-sm", className)}>
        {error.map((err, index) => (
          <li key={index}>{err}</li>
        ))}
      </ul>
    )
  );
}
