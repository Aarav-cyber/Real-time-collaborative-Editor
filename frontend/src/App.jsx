import { useState } from 'react'
import Editor from '@monaco-editor/react'

import './App.css'

function App() {

  return (
    <>
      <main className="h-screen w-full bg-gray-950 p-4 flex gap-4">
        <aside className="w-1/4 bg-neutral-800 rounded-lg p-4">
          <h2 className="text-white text-xl font-bold mb-4">
            Connected Users
          </h2>
        </aside>


        <section className="w-3/4 bg-neutral-800 rounded-lg p-4">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            theme="vs-dark"
            defaultValue={`console.log("Hello Aarav");`}
            onChange={(value) => {
              console.log(value);
            }}
          />
        </section>
      </main>
    </>
  )
}

export default App
