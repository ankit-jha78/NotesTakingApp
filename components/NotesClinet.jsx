"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
function NotesClinet({ initialNotes }) {
  const [notes, setNotes] = useState(initialNotes);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const createNote = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setLoading(true);
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      const result = await response.json();
      setLoading(false);
      // console.log(result);
      if (result.success) {
        setNotes([result.data, ...notes]);
        toast.success("Notes created successfully");
        setTitle("");
        setContent("");
      }
    } catch (error) {
      console.log("Error creating Note", error);
      toast.error("Something went wrong");
    }
  };

  const deleteNote = async (id) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        setNotes(notes.filter((note) => note._id !== id));
        toast.success("Note deleted successfully");
      }
    } catch (error) {
      console.error("Error Deleteing note", error);
      toast.error("Something went wrong");
    }
  };

  const startEdit = async (note) => {
    setEditingId(note._id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };
  const cancelEdit = async () => {
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
  };
  const updateNote = async (id) => {
    if (!editTitle.trim() || !editContent.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, content: editContent }),
      });
      const result = await response.json();
      if (result.success) {
        toast.success("Notes updated successfully");
        setNotes(
          notes.map((note) => {
            return note._id === id ? result.data : note;
          }),
        );
        setEditingId(null);
        setEditContent("");
        setEditTitle("");
      }
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("someThing went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <form className="bg-white p-6 rounded-lg shadow-md" onSubmit={createNote}>
        <h2
          className="text-xl text-gray-800
                font-semibold mb-4"
        >
          Create New Note
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md 
                   focus:outline-0 focus:ring-2 
                   focus:ring-blue-500 text-gray-800 "
            required
          />

          <textarea
            placeholder="Note Content"
            value={content}
            rows={4}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md 
                   focus:outline-0 focus:ring-2 
                   focus:ring-blue-500 text-gray-800 "
            required
          />
          <button
            type="Submit"
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600
          disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Note"}
          </button>
        </div>
      </form>
      <div className="space-y-4 ">
        <h2 className="text-xl font-semibold">Your Notes ({notes.length})</h2>
        {notes.length === 0 ? (
          <p>No Note Yet. Create Your first note about</p>
        ) : (
          notes.map((note) => (
            <div key={note._id} className="bg-white p-6 rounded-lg shadow-md">
              {editingId === note._id ? (
                <>
                  {/* eiditing mode */}
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Note Title"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md 
                   focus:outline-0 focus:ring-2 
                   focus:ring-blue-500 text-gray-800 "
                      required
                    />
                    <textarea
                      placeholder="Note Content"
                      value={editContent}
                      rows={4}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md 
                   focus:outline-0 focus:ring-2 
                   focus:ring-blue-500 text-gray-800 "
                      required
                    />
                    <div className="flex gap-2">
                       <button
                        className="text-blue-500 hover:text-blue-700 text-sm px-4 py-2 rounded-sm bg-gray-300"
                        onClick={() => updateNote(note._id)}
                      >
                        Save
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700 text-sm px-4 py-2 rounded-sm bg-gray-300"
                        onClick={() => cancelEdit()}
                      >
                        cancel
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-600">
                      {note.title}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        className="text-blue-500 hover:text-blue-700 text-sm px-4 py-2 rounded-sm bg-gray-300"
                        onClick={() => startEdit(note)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700 text-sm px-4 py-2 rounded-sm bg-gray-300"
                        onClick={() => deleteNote(note._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2">{note.content}</p>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                  {note.updatedAt !== note.createdAt && (
                    <p className="text-sm text-gray-500">
                      Updated: {new Date(note.updatedAt).toLocaleDateString()}
                    </p>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NotesClinet;
