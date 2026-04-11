"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { FaTags, FaTrashCan, FaPlus } from "react-icons/fa6";
import { toast } from "sonner";

interface Label {
  id: string;
  name: string;
  sortOrder: number;
}

export default function SettingsPage() {
  const router = useRouter();
  const [labels, setLabels] = useState<Label[]>([]);
  const [newLabel, setNewLabel] = useState("");

  useEffect(() => {
    fetch("/api/labels").then((r) => r.json()).then(setLabels);
  }, []);

  async function handleAdd() {
    const name = newLabel.trim();
    if (!name) return;
    const res = await fetch("/api/labels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      const label = await res.json();
      setLabels((prev) => [...prev, label]);
      setNewLabel("");
      toast.success("Label toegevoegd");
    } else {
      toast.error("Label bestaat al");
    }
  }

  async function handleDelete(id: string) {
    await fetch("/api/labels", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setLabels((prev) => prev.filter((l) => l.id !== id));
    toast.success("Label verwijderd");
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Instellingen</h1>
      </div>

      <div className="flex-1 px-4 py-4 space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <FaTags className="text-teal-500" />
              Snelle labels
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Maak labels aan die je snel kunt loggen met een tik.
            </p>

            <div className="flex gap-2">
              <Input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Nieuw label..."
                className="flex-1"
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
              <Button onClick={handleAdd} disabled={!newLabel.trim()} size="icon">
                <FaPlus />
              </Button>
            </div>

            {labels.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">
                Nog geen labels. Voeg er een toe hierboven.
              </p>
            ) : (
              <div className="space-y-1">
                {labels.map((label) => (
                  <div
                    key={label.id}
                    className="flex items-center justify-between rounded-md border px-3 py-2"
                  >
                    <span className="text-sm">{label.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(label.id)}
                    >
                      <FaTrashCan className="text-xs" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
