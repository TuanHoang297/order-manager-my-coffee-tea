import React, { useState } from 'react';
import { MessageSquare, Edit3, Plus } from 'lucide-react';

interface NoteInputProps {
  value: string;
  onSave: (note: string) => void;
  placeholder?: string;
}

export const NoteInput: React.FC<NoteInputProps> = ({
  value,
  onSave,
  placeholder = 'Thêm ghi chú...'
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [noteInput, setNoteInput] = useState(value || '');

  // Quick note suggestions
  const quickNotes = [
    'Ít đường',
    'Nhiều đá',
    'Ít đá',
    'Không đá',
    'Nóng',
    'Ngọt'
  ];

  const handleSave = () => {
    onSave(noteInput);
    setIsEditing(false);
  };

  const handleBlur = () => {
    handleSave();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setNoteInput(value || '');
    }
  };

  const handleQuickNote = (note: string) => {
    const currentNote = noteInput.trim();
    if (currentNote) {
      // Add to existing note with comma separator
      const newNote = `${currentNote}, ${note}`;
      setNoteInput(newNote);
    } else {
      // Set as first note
      setNoteInput(note);
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        <input
          type="text"
          value={noteInput}
          onChange={(e) => setNoteInput(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition-all"
          autoFocus
        />
        <div className="flex flex-wrap gap-1.5">
          {quickNotes.map((note) => (
            <button
              key={note}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleQuickNote(note);
              }}
              className="px-2.5 py-1 bg-white border border-gray-200 rounded-md text-xs text-gray-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-all active:scale-95"
            >
              {note}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => {
        setNoteInput(value || '');
        setIsEditing(true);
      }}
      className="w-full flex items-center gap-2 text-left text-sm transition-all bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
    >
      {value ? (
        <>
          <MessageSquare size={14} className="text-indigo-500 shrink-0" />
          <span className="flex-1 text-indigo-700 italic font-medium truncate">{value}</span>
          <Edit3 size={14} className="text-gray-400 shrink-0" />
        </>
      ) : (
        <>
          <MessageSquare size={14} className="text-gray-400" />
          <span className="text-gray-400 font-medium">{placeholder}</span>
        </>
      )}
    </button>
  );
};
