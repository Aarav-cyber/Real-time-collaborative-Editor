import { useRef, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import { SocketIOProvider } from "y-socket.io";
import * as Y from "yjs";

import "./App.css";

function App() {
  const editorRef = useRef(null);
  const providerRef = useRef(null);
  const bindingRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);

  const ydocRef = useRef(new Y.Doc());
  const ydoc = ydocRef.current;
  const yText = ydoc.getText("monaco");

  const handleMount = (editor) => {
    editorRef.current = editor;

    const provider = new SocketIOProvider(
      "http://localhost:3000",
      "monaco-room",
      ydoc,
      { autoConnect: true }
    );
    providerRef.current = provider;

    // set local user from username state (fallback to Anonymous)
    provider.awareness.setLocalStateField("user", {
      name: username?.trim() || "Anonymous",
    });

    // Awareness change handler
    const awarenessChangeHandler = () => {
      const states = Array.from(provider.awareness.getStates().values());
      const userList = states.map((s) => s.user).filter(Boolean);
      setUsers(userList);
      console.log("Awareness users:", userList);
    };

    provider._onAwarenessChange = awarenessChangeHandler;
    provider.awareness.on("change", awarenessChangeHandler);

    const binding = new MonacoBinding(
      yText,
      editor.getModel(),
      new Set([editor]),
      provider.awareness
    );
    bindingRef.current = binding;

    yText.observe(() => {
      console.log("Y.Text Content:");
      console.log(yText.toString());
    });

    console.log("Provider Connected");
    console.log("Binding Created");
  };

  useEffect(() => {
    return () => {
      if (bindingRef.current) bindingRef.current.destroy();

      if (providerRef.current) {
        if (
          providerRef.current._onAwarenessChange &&
          typeof providerRef.current.awareness.off === "function"
        ) {
          providerRef.current.awareness.off(
            "change",
            providerRef.current._onAwarenessChange
          );
        }

        if (typeof providerRef.current.disconnect === "function") {
          providerRef.current.disconnect();
        }
        if (typeof providerRef.current.destroy === "function") {
          providerRef.current.destroy();
        }
      }
    };
  }, []);

  // Join screen
  if (!joined) {
    return (
      <main className="h-screen w-full flex items-center justify-center bg-gray-950 p-4">
        <div className="w-full max-w-md bg-neutral-800 rounded-lg p-6">
          <h1 className="text-white text-2xl font-bold mb-4">
            Collaborative Editor
          </h1>

          <label className="text-white mb-2 block">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter a display name"
            className="w-full p-2 rounded mb-4 bg-gray-900 text-white"
          />

          <button
            onClick={() => {
              if (username.trim()) setJoined(true);
            }}
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Join
          </button>
        </div>
      </main>
    );
  }

  // Main editor UI (shows after joining)
  return (
    <main className="h-screen w-full bg-gray-950 p-4 flex gap-4">
      <aside className="w-1/4 bg-neutral-800 rounded-lg p-4">
        <h2 className="text-white text-xl font-bold mb-4">Connected Users</h2>
        <ul className="text-white">
          {users.map((user, index) => (
            <li key={index} className="mb-1">
              • {user.name}
            </li>
          ))}
        </ul>
      </aside>

      <section className="w-3/4 bg-neutral-800 rounded-lg p-4">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          theme="vs-dark"
          defaultValue={`console.log("Hello Aarav");`}
          onMount={handleMount}
        />
      </section>
    </main>
  );
}

export default App;