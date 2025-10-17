import { useState } from "react";
import { Button } from "./components/ui/button";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

const App = () => {
  const [lines, setLines] = useState<string[]>([]);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<boolean>(false);
  const runScript = async () => {
    try {
      setPending(true);
      setError(null);
      setSuccess(null);
      const response = await fetch(`${BASE_URL}/deploy/test`);
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!response.ok) return;

      if (!reader) return;

      let chunk;
      while (!(chunk = await reader.read()).done) {
        const text = decoder.decode(chunk.value);
        console.log(text);
        setLines((prev) => [...prev, text]);
      }
      setSuccess("The deploying of your app is completed successfully!!");
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setPending(false);
    }
  };

  if (error) return <ErrorMessage setError={setError} message={error} />;
  return (
    <div>
      <Button disabled={pending} onClick={runScript}>
        {pending ? (
          <>
            <span className="w-4 h-4 rounded-full border-r-transparent border-t-transparent border-zinc-700 animate-spin"></span>
            <span>Deploying app...</span>
          </>
        ) : (
          "Deploy"
        )}
      </Button>
      {success && <SuccessMessage setSuccess={setSuccess} message={success} />}
      <div>
        {lines && (
          <div className="flex flex-col items-start justify-start gap-2 bg-zinc-50 p-4 border border-zinc-400 my-2 w-1/2 mx-auto shadow-sm rounded-2xl">
            {lines.map((line, index) => {
              return (
                <p className="p-1 bg-zinc-100" key={index}>
                  {line}
                </p>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;

function ErrorMessage({
  message,
}: {
  message: string;
  setError?: (value: null | string) => void;
}) {
  // setTimeout(() => setError(null), 4000);
  return (
    <div className="p-2 rounded-md border border-red-700 text-red-700 bg-red-200 shadow-sm text-sm">
      {message}
    </div>
  );
}
function SuccessMessage({
  message,
  setSuccess,
}: {
  message: string;
  setSuccess: (value: null | string) => void;
}) {
  setTimeout(() => setSuccess(null), 4000);
  return (
    <div className="p-2 rounded-md border border-green-700 text-green-700 bg-green-200 shadow-sm  text-sm">
      {message}
    </div>
  );
}
