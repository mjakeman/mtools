import EnumConverter from './widgets/EnumConverter'

function App() {
  return (
    <div className="flex flex-col gap-4 w-full min-h-screen bg-zinc-50 max-w-screen-md p-16 m-auto">
      <header>
        <p className='text-black/50'><a className="underline" href="https://mattjakeman.com/">mattjakeman.com</a> / tools</p>
      </header>
      <EnumConverter />
    </div>
  )
}

export default App
