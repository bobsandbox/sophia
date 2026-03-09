"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { getBirthDate, setBirthDate, getBirthDateTime, getAge, formatAge } from "@/lib/birth-date";
import { FaCakeCandles } from "react-icons/fa6";
import { toast } from "sonner";

export default function SettingsPage() {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [preview, setPreview] = useState("");

  useEffect(() => {
    const bd = getBirthDate();
    if (bd) {
      setDate(bd.date);
      setTime(bd.time);
    }
  }, []);

  useEffect(() => {
    if (date && time) {
      const [y, m, d] = date.split("-").map(Number);
      const [h, min] = time.split(":").map(Number);
      const birth = new Date(y, m - 1, d, h, min);
      const age = getAge(birth);
      setPreview(formatAge(age));
    } else {
      setPreview("");
    }
  }, [date, time]);

  function handleSave() {
    if (!date || !time) return;
    setBirthDate({ date, time });
    toast.success("Geboortedatum opgeslagen");
    router.push("/");
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
              <FaCakeCandles className="text-pink-500" />
              Geboortedatum
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-sm font-medium">Datum</label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium">Tijdstip</label>
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            {preview && (
              <p className="text-sm text-muted-foreground italic">
                {preview}
              </p>
            )}

            <Button
              onClick={handleSave}
              disabled={!date || !time}
              className="w-full"
            >
              Opslaan
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
