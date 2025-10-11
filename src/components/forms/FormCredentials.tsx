// This component is designed as an easy drop-in to a form
// It provides the style and form fields for the username and passcode setup
export default function FormCredentials() {
  return (
    <div className="border border-accent1 rounded-md p-4 space-y-4">
      <h2 className="font-semibold text-accent1 mb-2">Credentials</h2>

      <div>
        <label className="block mb-1 font-medium" htmlFor="username">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium" htmlFor="passcode">
          Passcode
        </label>
        <input
          id="passcode"
          name="passcode"
          type="password"
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>
    </div>
  );
}
