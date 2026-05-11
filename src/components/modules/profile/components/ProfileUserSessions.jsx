"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Radio } from "@/components/ui/radio";
import { PlusIcon } from "@/icons";
import { Edit } from "lucide-react";
import DialogWrapper from "@/components/ui/dialog";

const ProfileUserSessions = () => {
  const [sessions, setSessions] = useState([
    {
      number: "۰۹۱۲۳۴۵۶۷۸۹",
      devices: ["Windows - Chrome", "iPhone - Safari"],
    },
  ]);

  const [selectedSession, setSelectedSession] = useState(sessions[0] || null);
  const [showAddSessionInput, setShowAddSessionInput] = useState(false);
  const [newSessionNumber, setNewSessionNumber] = useState("");
  const [editingSessionIndex, setEditingSessionIndex] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleOpenAddNewSession = () => {
    setShowAddSessionInput(true);
    setEditingSessionIndex(null);
    setNewSessionNumber("");
  };

  const handleSaveSession = (e) => {
    e.preventDefault();

    const number = newSessionNumber.trim();
    if (!number) return;

    if (editingSessionIndex !== null) {
      const updated = [...sessions];
      updated[editingSessionIndex].number = number;
      setSessions(updated);
      setEditingSessionIndex(null);
    } else {
      const newSession = {
        number,
        devices: ["دستگاه جدید"],
      };

      setSessions([newSession, ...sessions]);
      setShowAddSessionInput(false);
    }

    setNewSessionNumber("");
  };

  return (
    <>
      <div className="bg-gray-50 rounded-md p-4 border border-gray-100 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-primary rounded-full"></div>
            <label className="text-lg font-bold text-gray-800">
              نشست‌های فعال
            </label>
          </div>

          <button
            type="button"
            onClick={handleOpenAddNewSession}
            className="flex items-center gap-1 text-primary text-sm font-bold"
          >
            <PlusIcon size={14} />
            افزودن شماره
          </button>
        </div>

        {showAddSessionInput && (
          <div className="flex flex-col gap-3 mb-4 p-3 bg-white rounded-md border border-gray-200 shadow-sm">
            <Input
              type="number"
              placeholder="شماره تلفن..."
              value={newSessionNumber}
              onChange={(e) => setNewSessionNumber(e.target.value)}
            />

            <div className="self-end flex gap-2">
              <button
                onClick={handleSaveSession}
                className="bg-primary text-white px-4 h-9 rounded-md text-xs"
              >
                ذخیره شماره
              </button>

              <button
                onClick={() => setShowAddSessionInput(false)}
                className="text-gray-500 px-4 h-9 rounded-md text-xs"
              >
                لغو
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {sessions.map((session, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 p-3 rounded-md border-2 bg-white ${
                selectedSession?.number === session.number
                  ? "border-primary ring-1 ring-primary/20"
                  : "border-gray-200"
              }`}
            >
              <Radio
                checked={selectedSession?.number === session.number}
                onChange={() => setSelectedSession(session)}
              />

              <div className="flex-1 flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-800 font-medium">
                    {session.number}
                  </span>

                  <span className="text-xs text-gray-400 block mt-1">
                    دستگاه‌ها: {session.devices.join("، ")}
                  </span>
                </div>

                <button
                  onClick={() => setIsEditDialogOpen(true)}
                  className="text-primary"
                >
                  <Edit size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <DialogWrapper
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        title="تغییر شماره"
      >
        <p className="text-sm text-gray-700">
          برای تغییر شماره ابتدا باید در سامانه هدی احراز هویت کنید.
        </p>
      </DialogWrapper>
    </>
  );
};

export default ProfileUserSessions;
