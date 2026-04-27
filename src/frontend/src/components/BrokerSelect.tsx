import { Button } from "@/components/ui/button";
import { INDIAN_BROKERS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface BrokerSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  "data-ocid"?: string;
}

export function BrokerSelect({
  value,
  onChange,
  placeholder = "Select broker",
  className,
  "data-ocid": dataOcid,
}: BrokerSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = INDIAN_BROKERS.filter((b) =>
    b.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  function handleSelect(broker: string) {
    onChange(broker);
    setOpen(false);
    setSearch("");
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      data-ocid={dataOcid}
    >
      <Button
        type="button"
        variant="outline"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="w-full justify-between font-body font-normal"
        data-ocid={dataOcid ? `${dataOcid}.toggle` : undefined}
      >
        <span className={cn(!value && "text-muted-foreground")}>
          {value || placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </Button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-lg">
          <div className="flex items-center border-b border-border px-3 py-2 gap-2">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search brokers..."
              aria-label="Search brokers"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              data-ocid={dataOcid ? `${dataOcid}.search_input` : undefined}
            />
          </div>
          <ul aria-label="Brokers" className="max-h-56 overflow-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-muted-foreground">
                No broker found
              </li>
            ) : (
              filtered.map((broker) => (
                <li key={broker}>
                  <button
                    type="button"
                    onClick={() => handleSelect(broker)}
                    className={cn(
                      "flex w-full cursor-pointer items-center justify-between px-3 py-2 text-sm",
                      "hover:bg-accent/10 transition-colors focus:outline-none focus:bg-accent/10",
                      value === broker &&
                        "bg-primary/10 text-primary font-medium",
                    )}
                  >
                    {broker}
                    {value === broker && <Check className="h-4 w-4" />}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
